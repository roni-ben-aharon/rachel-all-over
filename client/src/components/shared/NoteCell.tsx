import { useState } from 'react'

interface NoteCellProps {
  note: string
  readOnly?: boolean
  onChange?: (note: string) => void
}

export function NoteCell({ note, readOnly = false, onChange }: NoteCellProps) {
  const [open, setOpen] = useState(false)
  const hasNote = note.trim().length > 0

  if (readOnly) {
    return (
      <>
        <td className="py-2 px-2 text-center">
          <button
            onClick={() => setOpen(o => !o)}
            className={`text-base font-medium leading-none ${hasNote ? 'text-gray-800 cursor-pointer' : 'text-gray-300'}`}
          >
            {open ? '−' : '+'}
          </button>
        </td>
        {open && hasNote && (
          <tr>
            <td colSpan={5} className="px-4 pb-2 bg-gray-50">
              <p className="text-xs text-gray-600 py-1">{note}</p>
            </td>
          </tr>
        )}
      </>
    )
  }

  return (
    <>
      <td className="py-2 px-2 text-center">
        <button
          onClick={() => setOpen(o => !o)}
          className={`text-sm leading-none ${hasNote ? 'text-gray-800' : 'text-gray-400'}`}
        >
          {hasNote ? '📝' : '+'}
        </button>
      </td>
      {open && (
        <tr>
          <td colSpan={6} className="px-3 pb-2 bg-gray-50 border-t border-gray-100">
            <input
              type="text"
              value={note}
              onChange={e => onChange?.(e.target.value)}
              placeholder="Add a note..."
              className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
            />
          </td>
        </tr>
      )}
    </>
  )
}
