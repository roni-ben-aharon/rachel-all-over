import { useState } from 'react'
import { Exercise } from '../../types'

interface WorkoutTableProps {
  label: string
  exercises: Exercise[]
  headerless?: boolean
}

function formatResistance(r: Exercise['resistance']): string {
  if (!r) return '—'
  if (r.type === 'kg') return r.value != null ? `${r.value} kg` : '—'
  if (r.type === 'band') {
    const colorEmoji: Record<string, string> = { red: '🔴', blue: '🔵', green: '🟢', black: '⚫', purple: '🟣' }
    const emoji = colorEmoji[r.bandColor ?? 'red'] ?? '⚪'
    const label = r.assisted ? 'assisted' : 'resistance'
    return `${emoji} ${r.bandColor ? r.bandColor.charAt(0).toUpperCase() + r.bandColor.slice(1) : ''} (${label})`
  }
  if (r.type === 'bodyweight') return 'Bodyweight'
  return '—'
}

export function WorkoutTable({ label, exercises, headerless }: WorkoutTableProps) {
  const [openNotes, setOpenNotes] = useState<Set<number>>(new Set())

  function toggleNote(i: number) {
    setOpenNotes(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const tableBody = (
    <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
      <thead>
        <tr className="bg-gray-50 border-b border-gray-100">
          <th className="text-left px-3 py-1.5 font-medium text-gray-400 w-[15%]">Muscle group</th>
          <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[12%]">Category</th>
          <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[12%]">Technique</th>
          <th className="text-left px-2 py-1.5 font-medium text-gray-400 w-[20%]">Exercise</th>
          <th className="text-center px-2 py-1.5 font-medium text-gray-400 w-[8%]">Sets</th>
          <th className="text-center px-2 py-1.5 font-medium text-gray-400 w-[8%]">Reps</th>
          <th className="text-right px-3 py-1.5 font-medium text-gray-400 w-[15%]">Resistance</th>
          <th className="text-center px-2 py-1.5 font-medium text-gray-400 w-[10%]">Notes</th>
        </tr>
      </thead>
      <tbody>
        {exercises.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-4 text-gray-400 text-xs italic">
              No exercises yet — click Edit program to add
            </td>
          </tr>
        ) : exercises.map((ex, i) => (
          <>
            <tr key={i} className="border-t border-gray-100">
              <td className="px-3 py-2 text-gray-500">{ex.muscleGroup ?? ''}</td>
              <td className="px-2 py-2 text-gray-500">{ex.category ?? ''}</td>
              <td className="px-2 py-2 text-gray-500">{ex.technique ?? ''}</td>
              <td className="px-2 py-2">{ex.name}</td>
              <td className="px-2 py-2 text-center text-gray-500">{ex.sets}</td>
              <td className="px-2 py-2 text-center text-gray-500">{ex.reps}</td>
              <td className="px-3 py-2 text-right text-gray-500">{formatResistance(ex.resistance)}</td>
              <td className="px-2 py-2 text-center">
                <button
                  onClick={() => ex.notes?.trim() ? toggleNote(i) : undefined}
                  className={`text-base leading-none ${ex.notes?.trim() ? 'text-gray-800 cursor-pointer' : 'text-gray-300 cursor-default'}`}
                >
                  {openNotes.has(i) ? '−' : '+'}
                </button>
              </td>
            </tr>
            {openNotes.has(i) && ex.notes?.trim() && (
              <tr key={`note-${i}`} className="border-t border-gray-100 bg-gray-50">
                <td colSpan={8} className="px-4 py-2">
                  <p className="text-xs text-gray-600">{ex.notes}</p>
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  )

  if (headerless) return tableBody

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <p className="text-xs font-medium">{label}</p>
        <span className="text-xs text-gray-400">{exercises.length} exercises</span>
      </div>
      {tableBody}
    </div>
  )
}
