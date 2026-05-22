/**
 * Seed script — populates Firebase emulator with clean test data.
 * Run: npm run seed
 * Requires emulator running: npm run emulator
 */

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXERCISES_JSON = JSON.parse(readFileSync(join(__dirname, 'exercises.json'), 'utf8'))

const BODYWEIGHT_PATTERNS = [
  /pull.?up/i, /chin.?up/i, /push.?up/i, /\bdips\b/i, /plank/i,
  /^bw\s/i, /\btrx\b/i, /lying leg raise/i, /hanging leg raise/i,
  /straight leg raise/i, /\bv.up/i, /\bhollow\b/i, /decline sit.?up/i,
  /ab wheel/i, /lying bird.?dog/i, /superman/i, /box climb/i,
  /negative nordic/i, /bulgarian split squat/i, /cossack squat/i,
  /single.?leg glute bridge/i, /negative incline push/i,
]
const BAND_PATTERNS = [/standing hip ext/i, /^face pull$/i, /pallof press/i]

function guessResistanceType(name) {
  if (BAND_PATTERNS.some(p => p.test(name))) return 'band'
  if (BODYWEIGHT_PATTERNS.some(p => p.test(name))) return 'bodyweight'
  return 'kg'
}

const app = initializeApp({ projectId: 'rachel-all-over' })
const db = getFirestore(app)

const AUTH_EMULATOR = 'http://localhost:9099'
const PROJECT = 'rachel-all-over'
const WORKOUT_LABELS = ['Workout A', 'Workout B', 'Workout C', 'Workout D', 'Workout E']

const SAMPLE_EXERCISES = [
  { name: 'Squat', sets: 4, reps: '8', resistance: { type: 'kg', value: 60 }, notes: 'Keep chest up', muscleGroup: 'Legs', category: 'Primary', technique: '' },
  { name: 'Romanian Deadlift', sets: 3, reps: '10', resistance: { type: 'kg', value: 50 }, notes: '', muscleGroup: 'Legs', category: 'Primary', technique: '' },
  { name: 'Leg Press', sets: 3, reps: '12', resistance: { type: 'kg', value: 80 }, notes: '', muscleGroup: 'Legs', category: 'Secondary', technique: '' },
]

// Create user in Auth emulator via REST API
const AUTH_HEADERS = { 'Content-Type': 'application/json', 'Authorization': 'Bearer owner' }

async function clearAuthUsers() {
  await fetch(`${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE', headers: AUTH_HEADERS })
}

async function createAuthUser(email, password) {
  const res = await fetch(`${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts`, {
    method: 'POST', headers: AUTH_HEADERS,
    body: JSON.stringify({ email, password, returnSecureToken: false }),
  })
  const data = await res.json()
  if (!data.localId) throw new Error(`Failed to create auth user ${email}: ${JSON.stringify(data)}`)
  return data.localId
}

async function clearCollection(colName) {
  const snap = await db.collection(colName).get()
  const batch = db.batch()
  snap.docs.forEach(d => batch.delete(d.ref))
  if (snap.docs.length > 0) await batch.commit()
  console.log(`  cleared ${colName} (${snap.docs.length} docs)`)
}

async function seed() {
  console.log('🌱 Seeding emulator...\n')

  await clearAuthUsers()
  console.log('  cleared auth users')
  for (const col of ['trainers', 'clients', 'programs', 'workouts', 'invites', 'exerciseLibrary']) {
    await clearCollection(col)
  }

  // Trainer
  const trainerUid = await createAuthUser('rachel@test.com', 'test1234')
  await db.collection('trainers').doc(trainerUid).set({ name: 'Rachel', email: 'rachel@test.com' })
  console.log(`\n  trainer: rachel@test.com / test1234 (uid: ${trainerUid})`)

  // Clients
  const clients = [
    { name: 'Ofir Inbar', email: 'ofir@test.com', daysPerWeek: 3 },
    { name: 'Roni Ben Aharon', email: 'roni@test.com', daysPerWeek: 2 },
    { name: 'Noa Galili', email: 'noa@test.com', daysPerWeek: 4 },
  ]

  for (const c of clients) {
    const clientUid = await createAuthUser(c.email, 'test1234')
    const clientRef = db.collection('clients').doc()
    await clientRef.set({
      trainerId: trainerUid,
      name: c.name,
      email: c.email,
      daysPerWeek: c.daysPerWeek,
      deleted: false,
      inviteAccepted: true,
    })

    const programRef = db.collection('programs').doc()
    await programRef.set({
      clientId: clientRef.id,
      trainerId: trainerUid,
      name: 'Strength Phase 1',
      active: true,
      deleted: false,
      createdAt: new Date(),
    })

    const count = Math.min(c.daysPerWeek, 5)
    for (let i = 0; i < count; i++) {
      await db.collection('workouts').doc().set({
        programId: programRef.id,
        clientId: clientRef.id,
        label: WORKOUT_LABELS[i],
        order: i,
        exercises: i === 0 ? SAMPLE_EXERCISES : [],
        updatedAt: new Date(),
      })
    }
    console.log(`  client: ${c.email} / test1234 (${c.daysPerWeek}x/week)`)
  }

  // Pending client — no Auth user yet, invite not accepted
  const pendingRef = db.collection('clients').doc()
  await pendingRef.set({
    trainerId: trainerUid,
    name: 'Dana Pending',
    email: 'dana@test.com',
    daysPerWeek: 3,
    deleted: false,
    inviteAccepted: false,
  })
  const pendingProgramRef = db.collection('programs').doc()
  await pendingProgramRef.set({
    clientId: pendingRef.id,
    trainerId: trainerUid,
    name: 'Strength Phase 1',
    active: true,
    deleted: false,
    createdAt: new Date(),
  })
  for (let i = 0; i < 3; i++) {
    await db.collection('workouts').doc().set({
      programId: pendingProgramRef.id,
      clientId: pendingRef.id,
      label: WORKOUT_LABELS[i],
      order: i,
      exercises: [],
    })
  }
  // Fixed-ID invite for E2E signup test
  await db.collection('invites').doc('test-invite-001').set({
    clientId: pendingRef.id,
    trainerId: trainerUid,
    email: 'dana@test.com',
    used: false,
    createdAt: new Date(),
    trainerName: 'Rachel',
  })
  console.log('  pending client: dana@test.com (invite: test-invite-001)')

  // Exercise library
  const libBatch = db.batch()
  for (const ex of EXERCISES_JSON) {
    const ref = db.collection('exerciseLibrary').doc()
    libBatch.set(ref, {
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      category: ex.category,
      defaultResistanceType: guessResistanceType(ex.name),
      createdBy: 'system',
      createdAt: new Date(),
    })
  }
  await libBatch.commit()
  console.log(`\n  exerciseLibrary: ${EXERCISES_JSON.length} exercises seeded`)

  console.log('\n✅ Done. Emulator UI: http://localhost:4000')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
