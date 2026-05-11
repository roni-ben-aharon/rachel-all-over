import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { WorkoutTableEdit } from '../components/trainer/WorkoutTableEdit'
import { SessionModal } from '../components/trainer/SessionModal'
import { ExcelImportModal } from '../components/trainer/ExcelImportModal'
import { Exercise, Workout, WorkoutVersion } from '../types'
import { getTemplate, templateDescription } from '../lib/programTemplates'

export function WorkoutSession() {
  const { clientId, workoutId } = useParams<{ clientId: string; workoutId: string }>()
  const navigate = useNavigate()

  const [clientName, setClientName] = useState('')
  const [daysPerWeek, setDaysPerWeek] = useState(2)
  const [programName, setProgramName] = useState('')
  const [programId, setProgramId] = useState('')
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([])
  const [activeWorkoutId, setActiveWorkoutId] = useState(workoutId ?? '')
  const [exercisesByWorkout, setExercisesByWorkout] = useState<Record<string, Exercise[]>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sessionStart] = useState(new Date())
  const [latestVersions, setLatestVersions] = useState<Record<string, WorkoutVersion | null>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!clientId) return
    async function load() {
      const clientSnap = await getDocs(query(collection(db, 'clients'), where('__name__', '==', clientId)))
      if (!clientSnap.empty) {
        const cd = clientSnap.docs[0].data()
        setClientName(cd.name)
        setDaysPerWeek(cd.daysPerWeek ?? 2)
      }

      const progSnap = await getDocs(query(collection(db, 'programs'), where('clientId', '==', clientId), where('active', '==', true)))
      if (!progSnap.empty) {
        const prog = progSnap.docs[0]
        setProgramName(prog.data().name)
        setProgramId(prog.id)

        const workoutsSnap = await getDocs(query(collection(db, 'workouts'), where('programId', '==', prog.id), orderBy('order')))
        const wks = workoutsSnap.docs.map(d => ({ exercises: [], ...d.data(), id: d.id } as unknown as Workout))
        setAllWorkouts(wks)

        const exMap: Record<string, Exercise[]> = {}
        const verMap: Record<string, WorkoutVersion | null> = {}
        for (const w of wks) {
          const verSnap = await getDocs(query(collection(db, 'workoutVersions'), where('workoutId', '==', w.id), orderBy('createdAt', 'desc')))
          const latest = verSnap.empty ? null : ({ id: verSnap.docs[0].id, ...verSnap.docs[0].data() } as WorkoutVersion)
          exMap[w.id] = latest?.exercises ?? []
          verMap[w.id] = latest
        }
        setExercisesByWorkout(exMap)
        setLatestVersions(verMap)
      }
      setLoaded(true)
    }
    load()
  }, [clientId])

  function updateExercises(wId: string, exercises: Exercise[]) {
    setExercisesByWorkout(prev => ({ ...prev, [wId]: exercises }))
    setIsDirty(true)
  }

  async function saveSession(overwrite: boolean) {
    setSaving(true)
    for (const w of allWorkouts) {
      const exercises = exercisesByWorkout[w.id] ?? []
      if (overwrite && latestVersions[w.id]) {
        await updateDoc(doc(db, 'workoutVersions', latestVersions[w.id]!.id), { exercises, createdAt: serverTimestamp() })
      } else {
        await addDoc(collection(db, 'workoutVersions'), {
          workoutId: w.id, clientId, createdAt: serverTimestamp(), exercises,
        })
      }
    }
    setSaving(false)
    navigate('/dashboard')
  }

  const hasExisting = Object.values(latestVersions).some(v => v !== null)

  function handleExcelImport(workouts: { label: string; exercises: Exercise[] }[]) {
    const updated: Record<string, Exercise[]> = { ...exercisesByWorkout }
    workouts.forEach((w, i) => {
      const target = allWorkouts[i]
      if (target) updated[target.id] = w.exercises
    })
    setExercisesByWorkout(updated)
    setIsDirty(true)
  }

  async function applyTemplate() {
    const template = getTemplate(daysPerWeek)
    const updated: Record<string, Exercise[]> = {}
    const updatedWorkouts = [...allWorkouts]

    for (let i = 0; i < template.length; i++) {
      if (i < updatedWorkouts.length) {
        // Update existing workout label if needed
        updated[updatedWorkouts[i].id] = template[i].exercises
      } else if (programId) {
        // Create missing workout docs
        const ref = await addDoc(collection(db, 'workouts'), {
          programId, clientId, label: template[i].label, order: i,
        })
        const newW: Workout = { id: ref.id, programId, clientId: clientId!, label: template[i].label, order: i, exercises: [] }
        updatedWorkouts.push(newW)
        updated[ref.id] = template[i].exercises
      }
    }

    setAllWorkouts(updatedWorkouts)
    setExercisesByWorkout(updated)
    setActiveWorkoutId(updatedWorkouts[0]?.id ?? '')
    setIsDirty(true)
  }

  const isFreshProgram = loaded &&
    allWorkouts.length > 0 &&
    allWorkouts.every(w => (exercisesByWorkout[w.id] ?? []).length === 0) &&
    !isDirty

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Warning banner */}
      <div className="px-5 py-3 border-b border-amber-200 flex items-center justify-between bg-amber-50">
        <div>
          <p className="text-sm font-medium text-amber-800">Editing session — {clientName}</p>
          <p className="text-xs text-amber-600 mt-0.5">Changes saved as a new version when you end the session</p>
        </div>
        <button
          onClick={() => setShowEndModal(true)}
          className="text-xs px-4 py-1.5 bg-amber-800 text-white rounded-md"
        >
          End session
        </button>
      </div>

      {/* Workout tabs */}
      <div className="px-5 py-2.5 border-b border-gray-200 flex gap-2 items-center justify-between">
        <div className="flex gap-2">
          {allWorkouts.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWorkoutId(w.id)}
              className={`text-xs px-4 py-1.5 rounded-md ${activeWorkoutId === w.id ? 'bg-gray-900 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
            >
              {w.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50"
        >
          📊 Import from Excel
        </button>
      </div>

      {/* Template banner */}
      {isFreshProgram && (
        <div className="mx-5 mt-4 border border-blue-100 bg-blue-50 rounded-xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-800">New program — suggested template</p>
            <p className="text-xs text-blue-600 mt-0.5">{templateDescription(daysPerWeek)} · based on {daysPerWeek}x / week</p>
            <p className="text-xs text-gray-400 mt-1.5">Blank rows added. Fill in exercise names and save.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={applyTemplate}
              className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Use template
            </button>
          </div>
        </div>
      )}

      {/* Exercise table */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeWorkoutId && (
          <WorkoutTableEdit
            exercises={exercisesByWorkout[activeWorkoutId] ?? []}
            onChange={exs => updateExercises(activeWorkoutId, exs)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs text-gray-400">{programName} · Started {sessionStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className={`text-xs ${isDirty ? 'text-amber-600' : 'text-gray-400'}`}>
          {isDirty ? 'Unsaved changes' : 'No changes yet'}
        </p>
      </div>

      {showEndModal && (
        <SessionModal
          onSaveNew={() => saveSession(false)}
          onOverwrite={() => saveSession(true)}
          onCancel={() => setShowEndModal(false)}
          hasExisting={hasExisting}
          saving={saving}
        />
      )}

      {showImportModal && (
        <ExcelImportModal
          onImport={handleExcelImport}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  )
}
