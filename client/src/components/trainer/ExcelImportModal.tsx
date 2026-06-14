import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Exercise } from '../../types'

interface WorkoutData {
  label: string
  exercises: Exercise[]
}

interface ExcelImportModalProps {
  onImport: (workouts: WorkoutData[]) => void
  onClose: () => void
}

function parseResistance(raw: unknown): Exercise['resistance'] {
  const str = String(raw ?? '').trim().toLowerCase()
  if (!str || str === '-' || str === 'bodyweight' || str === 'bw' || str === '') {
    return { type: 'bodyweight' }
  }
  const bandColors = ['red', 'green', 'blue', 'black', 'purple', 'yellow', 'orange', 'pink']
  for (const color of bandColors) {
    if (str.includes(color) && (str.includes('bend') || str.includes('band') || str.includes('גומי'))) {
      return { type: 'band', bandColor: color, assisted: str.includes('assist') }
    }
  }
  // e.g. "25 kg", "10/25 kg", "15/30" — take last number
  const nums = str.match(/[\d.]+/g)
  if (nums) {
    const last = parseFloat(nums[nums.length - 1])
    if (!isNaN(last) && last > 0) return { type: 'kg', value: last }
  }
  return { type: 'bodyweight' }
}

function parseSheetToWorkouts(rows: unknown[][]): WorkoutData[] {
  // Find header row
  const headerRowIdx = rows.findIndex(row =>
    row.some(cell => String(cell ?? '').toLowerCase().includes('exercise') ||
      String(cell ?? '').toLowerCase().includes('workout'))
  )
  if (headerRowIdx < 0) return []
  const headers = rows[headerRowIdx].map(h => String(h ?? '').toLowerCase())

  // Map columns
  const col = (names: string[]) => names.map(n => headers.findIndex(h => h.includes(n))).find(i => i >= 0) ?? -1
  const programCol = col(['program'])
  const exerciseCol = col(['exercise', 'workout'])
  const setsCol = col(['set'])
  const repsCol = col(['rep'])
  const weightCol = col(['weight', 'resistance'])
  const notesCol = col(['note', 'update', 'rpe'])

  if (exerciseCol < 0) return []

  const workoutsMap: Map<string, Exercise[]> = new Map()
  let currentProgram = 'Workout A'
  let programIndex = 0
  const programLabels = ['Workout A', 'Workout B', 'Workout C', 'Workout D']

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.every(c => !c)) continue

    // New program section detected
    if (programCol >= 0) {
      const prog = String(row[programCol] ?? '').trim()
      if (prog && prog.length > 0 && prog !== currentProgram) {
        programIndex = Math.min(programIndex + (workoutsMap.has(currentProgram) ? 1 : 0), programLabels.length - 1)
        currentProgram = programLabels[programIndex]
      }
    }

    const name = String(row[exerciseCol] ?? '').trim()
      .split('\n')[0] // take first line if multiline
      .trim()
    if (!name || name.length < 2) continue

    const rawSets = String(row[setsCol] ?? '').split('\n')[0].trim()
    const sets = parseInt(rawSets) || 3

    const rawReps = String(row[repsCol] ?? '').split('\n')[0].trim()
    const reps = rawReps || '10'

    const resistance = parseResistance(row[weightCol] ?? '')
    const notes = String(row[notesCol] ?? '').split('\n')[0].trim()

    if (!workoutsMap.has(currentProgram)) workoutsMap.set(currentProgram, [])
    workoutsMap.get(currentProgram)!.push({ name, sets, reps, resistance, notes })
  }

  return Array.from(workoutsMap.entries()).map(([label, exercises]) => ({ label, exercises }))
}

export function ExcelImportModal({ onImport, onClose }: ExcelImportModalProps) {
  const [sheets, setSheets] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState('')
  const [preview, setPreview] = useState<WorkoutData[]>([])
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [step, setStep] = useState<'upload' | 'sheet' | 'preview'>('upload')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const data = ev.target?.result
      const wb = XLSX.read(data, { type: 'array' })
      setWorkbook(wb)
      // Filter to client sheets ($ prefix) plus any named sheet
      const clientSheets = wb.SheetNames.filter(n => n.startsWith('$') || !n.startsWith('$'))
      setSheets(clientSheets)
      setStep('sheet')
    }
    reader.readAsArrayBuffer(file)
  }

  function handleSheetSelect(sheetName: string) {
    if (!workbook) return
    setSelectedSheet(sheetName)
    const ws = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' })
    const workouts = parseSheetToWorkouts(rows as unknown[][])
    setPreview(workouts)
    setStep('preview')
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[480px] shadow-xl max-h-[80vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium">Import from Excel</p>
          <button onClick={onClose} className="text-gray-400 text-sm">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {step === 'upload' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="text-3xl">📊</div>
              <p className="text-sm text-gray-600 text-center">Upload your Workout-Planner.xlsx file.<br />Exercises will be imported automatically.</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md"
              >
                Choose Excel file
              </button>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
            </div>
          )}

          {step === 'sheet' && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 mb-2">Select the client sheet to import from:</p>
              {sheets.map(name => (
                <button
                  key={name}
                  onClick={() => handleSheetSelect(name)}
                  className="w-full text-left text-sm px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {name.startsWith('$') ? name.slice(1) : name}
                </button>
              ))}
            </div>
          )}

          {step === 'preview' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-gray-500">Found {preview.length} workout(s) in <strong>{selectedSheet.startsWith('$') ? selectedSheet.slice(1) : selectedSheet}</strong>. Review before importing:</p>
              {preview.map((w, wi) => (
                <div key={wi} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex justify-between">
                    <p className="text-xs font-medium">{w.label}</p>
                    <span className="text-xs text-gray-400">{w.exercises.length} exercises</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {w.exercises.map((ex, ei) => (
                      <div key={ei} className="px-3 py-2 flex items-center justify-between">
                        <p className="text-xs font-medium">{ex.name}</p>
                        <p className="text-xs text-gray-400">{ex.sets} × {ex.reps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {step === 'preview' && (
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
            <button onClick={() => setStep('sheet')} className="flex-1 py-2 text-sm border border-gray-200 rounded-md">Back</button>
            <button
              onClick={() => { onImport(preview); onClose() }}
              className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-md"
            >
              Import {preview.reduce((s, w) => s + w.exercises.length, 0)} exercises
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
