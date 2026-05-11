import { useState } from 'react'
import { Exercise, ResistanceType } from '../../types'

const BAND_COLORS = ['red', 'blue', 'green', 'black', 'purple']
const BAND_EMOJIS: Record<string, string> = { red: '🔴', blue: '🔵', green: '🟢', black: '⚫', purple: '🟣' }

function ResistanceInput({ resistance, onChange }: { resistance: Exercise['resistance']; onChange: (r: Exercise['resistance']) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <select
        value={resistance.type}
        onChange={e => {
          const t = e.target.value as ResistanceType
          if (t === 'kg') onChange({ type: 'kg', value: 0 })
          else if (t === 'band') onChange({ type: 'band', bandColor: 'red', assisted: false })
          else onChange({ type: 'bodyweight' })
        }}
        className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full"
      >
        <option value="kg">kg</option>
        <option value="band">Band</option>
        <option value="bodyweight">Bodyweight</option>
      </select>

      {resistance.type === 'kg' && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={resistance.value ?? ''}
            onChange={e => onChange({ ...resistance, value: parseFloat(e.target.value) || 0 })}
            className="w-14 text-xs border border-gray-200 rounded px-1.5 py-1"
          />
          <span className="text-xs text-gray-400">kg</span>
        </div>
      )}

      {resistance.type === 'band' && (
        <div className="flex flex-col gap-1">
          <select
            value={resistance.bandColor ?? 'red'}
            onChange={e => onChange({ ...resistance, bandColor: e.target.value })}
            className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full"
          >
            {BAND_COLORS.map(c => (
              <option key={c} value={c}>{BAND_EMOJIS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onChange({ ...resistance, assisted: !resistance.assisted })}
            className="text-xs text-left text-gray-500 underline"
          >
            {resistance.assisted ? 'Assisted' : 'Resistance'}
          </button>
        </div>
      )}
    </div>
  )
}

interface WorkoutTableEditProps {
  exercises: Exercise[]
  onChange: (exercises: Exercise[]) => void
}

export function WorkoutTableEdit({ exercises, onChange }: WorkoutTableEditProps) {
  const [openNotes, setOpenNotes] = useState<Set<number>>(new Set())

  function toggleNote(i: number) {
    setOpenNotes(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function updateExercise(i: number, patch: Partial<Exercise>) {
    onChange(exercises.map((ex, idx) => idx === i ? { ...ex, ...patch } : ex))
  }

  function removeExercise(i: number) {
    onChange(exercises.filter((_, idx) => idx !== i))
  }

  function addExercise() {
    onChange([...exercises, {
      muscleGroup: '', category: '', technique: '', name: '',
      sets: 3, reps: '10', resistance: { type: 'kg', value: 0 }, notes: '',
    }])
  }

  return (
    <div>
      <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[13%]">Muscle group</th>
            <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[10%]">Category</th>
            <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[10%]">Technique</th>
            <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[20%]">Exercise</th>
            <th className="text-center px-1 py-1.5 font-medium text-gray-400 w-[7%]">Sets</th>
            <th className="text-center px-1 py-1.5 font-medium text-gray-400 w-[7%]">Reps</th>
            <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[18%]">Resistance</th>
            <th className="text-center px-1 py-1.5 font-medium text-gray-400 w-[8%]">Notes</th>
            <th className="w-[7%]"></th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <>
              <tr key={i} className="border-t border-gray-100">
                <td className="px-1 py-1.5">
                  <input
                    value={ex.muscleGroup ?? ''}
                    onChange={e => updateExercise(i, { muscleGroup: e.target.value })}
                    placeholder="e.g. Back"
                    className="w-full text-xs border border-gray-200 rounded px-1.5 py-1"
                  />
                </td>
                <td className="px-1 py-1.5">
                  <input
                    value={ex.category ?? ''}
                    onChange={e => updateExercise(i, { category: e.target.value })}
                    placeholder="e.g. Primary"
                    className="w-full text-xs border border-gray-200 rounded px-1.5 py-1"
                  />
                </td>
                <td className="px-1 py-1.5">
                  <input
                    value={ex.technique ?? ''}
                    onChange={e => updateExercise(i, { technique: e.target.value })}
                    placeholder="e.g. Super set"
                    className="w-full text-xs border border-gray-200 rounded px-1.5 py-1"
                  />
                </td>
                <td className="px-1 py-1.5">
                  <input
                    value={ex.name}
                    onChange={e => updateExercise(i, { name: e.target.value })}
                    placeholder="Exercise name *"
                    className={`w-full text-xs border rounded px-1.5 py-1 ${!ex.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                </td>
                <td className="px-1 py-1.5 text-center">
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={e => updateExercise(i, { sets: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs border border-gray-200 rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="px-1 py-1.5 text-center">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={ex.reps}
                    onChange={e => updateExercise(i, { reps: e.target.value })}
                    className={`w-full text-xs border rounded px-1 py-1 text-center ${!/^\d+$/.test(ex.reps?.trim() ?? '') || parseInt(ex.reps) <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                </td>
                <td className="px-1 py-1.5">
                  <ResistanceInput
                    resistance={ex.resistance}
                    onChange={r => updateExercise(i, { resistance: r })}
                  />
                </td>
                <td className="px-1 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => toggleNote(i)}
                    className={`text-sm leading-none ${ex.notes?.trim() ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    {ex.notes?.trim() ? '📝' : '+'}
                  </button>
                </td>
                <td className="px-1 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="text-red-400 text-xs leading-none"
                  >
                    ✕
                  </button>
                </td>
              </tr>
              {openNotes.has(i) && (
                <tr key={`note-${i}`} className="border-t border-gray-100 bg-gray-50">
                  <td colSpan={9} className="px-3 pb-2 pt-1">
                    <input
                      value={ex.notes}
                      onChange={e => updateExercise(i, { notes: e.target.value })}
                      placeholder="Add a note..."
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button
          type="button"
          onClick={addExercise}
          className="w-full text-xs py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700"
        >
          + Add exercise
        </button>
      </div>
    </div>
  )
}
