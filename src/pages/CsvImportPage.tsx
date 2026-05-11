import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import * as XLSX from 'xlsx'
import { db } from '../lib/firebase'
import { Exercise, Workout } from '../types'

interface ParsedExercise extends Exercise {
  resistanceRaw: string | null
}

interface ParsedWorkout {
  label: string
  exercises: ParsedExercise[]
}

function parseResistance(raw: string): { resistance: Exercise['resistance']; raw: string | null } {
  const str = raw.trim().toLowerCase()
  if (!str || str === '-' || str === 'bodyweight' || str === 'bw') {
    return { resistance: { type: 'bodyweight' }, raw: null }
  }
  const bandColors = ['red', 'green', 'blue', 'black', 'purple', 'yellow', 'orange', 'pink']
  for (const color of bandColors) {
    if (str.includes(color) && (str.includes('band') || str.includes('bend') || str.includes('גומי'))) {
      return { resistance: { type: 'band', bandColor: color, assisted: str.includes('assist') }, raw: null }
    }
  }
  const strictKg = str.match(/^(\d+(?:\.\d+)?)\s*kg$/)
  if (strictKg) {
    return { resistance: { type: 'kg', value: parseFloat(strictKg[1]) }, raw: null }
  }
  return { resistance: { type: 'bodyweight' }, raw: raw.trim() }
}

function parseRows(rows: unknown[][]): ParsedWorkout[] {
  const headerRowIdx = rows.findIndex(row =>
    row.some(cell => {
      const s = String(cell ?? '').toLowerCase()
      return s.includes('exercise') || s.includes('program')
    })
  )
  if (headerRowIdx < 0) return []

  const headers = rows[headerRowIdx].map(h => String(h ?? '').toLowerCase().trim())
  const col = (names: string[]) => names.map(n => headers.findIndex(h => h.includes(n))).find(i => i >= 0) ?? -1

  const programCol = col(['program'])
  const muscleCol = col(['muscle'])
  const categoryCol = col(['category', 'categ'])
  const exerciseCol = col(['exercise'])
  const setsCol = col(['set'])
  const repsCol = col(['rep'])
  const weightCol = col(['weight', 'resistance'])
  const notesCol = col(['note', 'update', 'rpe'])

  if (exerciseCol < 0) return []

  const workoutMap: Map<string, ParsedExercise[]> = new Map()
  const programLabels = ['Workout A', 'Workout B', 'Workout C', 'Workout D', 'Workout E']
  let currentProgram = ''
  let programIndex = -1

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.every(c => !c)) continue

    if (programCol >= 0) {
      const prog = String(row[programCol] ?? '').trim()
      if (prog && prog !== currentProgram) {
        programIndex = Math.min(programIndex + 1, programLabels.length - 1)
        currentProgram = prog
      }
    } else if (programIndex < 0) {
      programIndex = 0
    }

    const name = String(row[exerciseCol] ?? '').split('\n')[0].trim()
    if (!name || name.length < 2) continue

    const label = programLabels[Math.max(0, programIndex)]
    const sets = parseInt(String(row[setsCol] ?? '').split('\n')[0]) || 3
    const reps = String(row[repsCol] ?? '').split('\n')[0].trim() || '10'
    const rawWeight = String(row[weightCol] ?? '').split('\n')[0].trim()
    const { resistance, raw: resistanceRaw } = parseResistance(rawWeight)
    const notesRaw = String(row[notesCol] ?? '').split('\n')[0].trim()
    const notes = resistanceRaw
      ? (notesRaw ? `Resistance: ${resistanceRaw} | ${notesRaw}` : `Resistance: ${resistanceRaw}`)
      : notesRaw
    const muscleGroup = muscleCol >= 0 ? String(row[muscleCol] ?? '').trim() : ''
    const category = categoryCol >= 0 ? String(row[categoryCol] ?? '').trim() : ''

    if (!workoutMap.has(label)) workoutMap.set(label, [])
    workoutMap.get(label)!.push({ name, sets, reps, resistance, notes, muscleGroup, category, resistanceRaw })
  }

  return Array.from(workoutMap.entries()).map(([label, exercises]) => ({ label, exercises }))
}

function formatResistanceDisplay(ex: ParsedExercise): { text: string; error: boolean } {
  if (ex.resistanceRaw !== null) return { text: '—', error: true }
  const r = ex.resistance
  if (r.type === 'kg') return { text: `${r.value} kg`, error: false }
  if (r.type === 'band') return { text: `${r.bandColor ?? ''} band`, error: false }
  return { text: 'Bodyweight', error: false }
}

export function CsvImportPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [fileName, setFileName] = useState('')
  const [parsed, setParsed] = useState<ParsedWorkout[]>([])
  const [saving, setSaving] = useState(false)
  const [clientName, setClientName] = useState('')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [programId, setProgramId] = useState('')

  useEffect(() => {
    if (!clientId) return
    async function load() {
      const cSnap = await getDocs(query(collection(db, 'clients'), where('__name__', '==', clientId)))
      if (!cSnap.empty) setClientName(cSnap.docs[0].data().name)

      const pSnap = await getDocs(query(collection(db, 'programs'), where('clientId', '==', clientId), where('active', '==', true)))
      if (!pSnap.empty) {
        const pid = pSnap.docs[0].id
        setProgramId(pid)
        const wSnap = await getDocs(query(collection(db, 'workouts'), where('programId', '==', pid), orderBy('order')))
        setWorkouts(wSnap.docs.map(d => ({ id: d.id, ...d.data() } as Workout)))
      }
    }
    load()
  }, [clientId])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      const wb = XLSX.read(ev.target?.result, { type: 'array' })
      const sheetName = wb.SheetNames[0]
      const rows = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[sheetName], { header: 1, defval: '' })
      setParsed(parseRows(rows as unknown[][]))
      setStep('preview')
    }
    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!clientId || !programId) return
    setSaving(true)
    for (let i = 0; i < parsed.length; i++) {
      const workout = workouts[i]
      if (!workout) continue
      const exercises = parsed[i].exercises.map(({ resistanceRaw: _r, ...ex }) => ex)
      await addDoc(collection(db, 'workoutVersions'), {
        workoutId: workout.id,
        clientId,
        createdAt: serverTimestamp(),
        exercises,
      })
    }
    setSaving(false)
    navigate('/dashboard')
  }

  const totalExercises = parsed.reduce((s, w) => s + w.exercises.length, 0)
  const needsAttention = parsed.reduce((s, w) => s + w.exercises.filter(ex => ex.resistanceRaw !== null).length, 0)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
        <div>
          {step === 'preview' ? (
            <>
              <p className="text-sm font-medium">Preview — {fileName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {totalExercises} exercises · {parsed.length} workouts
                {needsAttention > 0 && <span className="text-red-500"> · {needsAttention} resistance values need attention</span>}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium">Import program — {clientName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs px-4 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          {step === 'preview' && (
            <button
              onClick={handleImport}
              disabled={saving}
              className="text-xs px-4 py-1.5 bg-gray-900 text-white rounded-md disabled:opacity-50"
            >
              {saving ? 'Importing...' : 'Import program'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
            <div className="text-4xl">📄</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800">Upload client program file</p>
              <p className="text-xs text-gray-400 mt-1">Accepts .csv or .xlsx</p>
            </div>
            <div className="text-xs text-gray-400 border border-gray-100 rounded-lg px-4 py-3 bg-gray-50">
              Expected columns: Program · Muscle group · Category · Exercise · Sets · Reps · Weight/Resistance · Notes
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-sm px-5 py-2 bg-gray-900 text-white rounded-md"
            >
              Choose file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        )}

        {step === 'preview' && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-medium text-gray-400 w-[9%]">Workout</th>
                  <th className="text-left px-2 py-2 font-medium text-gray-400 w-[14%]">Muscle group</th>
                  <th className="text-left px-2 py-2 font-medium text-gray-400 w-[12%]">Category</th>
                  <th className="text-left px-2 py-2 font-medium text-gray-400 w-[24%]">Exercise</th>
                  <th className="text-center px-2 py-2 font-medium text-gray-400 w-[7%]">Sets</th>
                  <th className="text-center px-2 py-2 font-medium text-gray-400 w-[7%]">Reps</th>
                  <th className="text-left px-2 py-2 font-medium text-gray-400 w-[16%]">Resistance</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-400 w-[11%]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {parsed.map((workout, wi) =>
                  workout.exercises.map((ex, ei) => {
                    const { text: resText, error: resError } = formatResistanceDisplay(ex)
                    const isFirstInWorkout = ei === 0
                    return (
                      <WorkoutExRow
                        key={`${wi}-${ei}`}
                        ex={ex}
                        workoutLabel={isFirstInWorkout ? workout.label : ''}
                        resText={resText}
                        resError={resError}
                        isFirstInWorkout={isFirstInWorkout}
                      />
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function WorkoutExRow({
  ex, workoutLabel, resText, resError, isFirstInWorkout,
}: {
  ex: ParsedExercise
  workoutLabel: string
  resText: string
  resError: boolean
  isFirstInWorkout: boolean
}) {
  const [open, setOpen] = useState(false)
  const hasNote = ex.notes.trim() !== ''

  return (
    <>
      <tr className={`border-t border-gray-100 ${isFirstInWorkout ? 'bg-gray-50' : ''}`}>
        <td className={`px-4 py-2 ${isFirstInWorkout ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
          {workoutLabel}
        </td>
        <td className="px-2 py-2 text-gray-500">{ex.muscleGroup}</td>
        <td className="px-2 py-2 text-gray-500">{ex.category}</td>
        <td className="px-2 py-2 text-gray-800">{ex.name}</td>
        <td className="px-2 py-2 text-center text-gray-500">{ex.sets}</td>
        <td className="px-2 py-2 text-center text-gray-500">{ex.reps}</td>
        <td className={`px-2 py-2 ${resError ? 'text-red-500' : 'text-gray-700'}`}>{resText}</td>
        <td className="px-4 py-2 text-center">
          {hasNote ? (
            <button
              onClick={() => setOpen(o => !o)}
              className={`text-base leading-none font-light ${resError ? 'text-red-500' : 'text-gray-800'}`}
            >
              {open ? '−' : '+'}
            </button>
          ) : (
            <span className="text-base leading-none text-gray-200">+</span>
          )}
        </td>
      </tr>
      {open && hasNote && (
        <tr className={resError ? 'bg-red-50' : 'bg-gray-50'}>
          <td colSpan={8} className="px-4 pb-2.5 pt-1">
            <span className={`text-xs ${resError ? 'text-red-500' : 'text-gray-600'}`}>
              <span className="font-medium">{resError ? 'Resistance' : 'Note'}:</span>{' '}
              {resError ? ex.resistanceRaw : ex.notes}
            </span>
          </td>
        </tr>
      )}
    </>
  )
}
