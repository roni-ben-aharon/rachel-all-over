import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { ExerciseLibraryItem, ResistanceType } from '../../types'

interface Props {
  value: string
  onChange: (name: string) => void
  onAutoFill: (data: { muscleGroup: string; category: string; defaultResistanceType: ResistanceType }) => void
  onAddToLibrary: (name: string) => void
  search: (query: string) => ExerciseLibraryItem[]
  hasError?: boolean
}

export function ExerciseCombobox({ value, onChange, onAutoFill, onAddToLibrary, search, hasError }: Props) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = open && value.trim() ? search(value) : []
  const hasExactMatch = results.some(r => r.name.toLowerCase() === value.toLowerCase())
  const showAddOption = open && value.trim().length > 0 && !hasExactMatch

  useEffect(() => {
    setHighlighted(0)
  }, [value])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function selectResult(item: ExerciseLibraryItem) {
    onChange(item.name)
    onAutoFill({ muscleGroup: item.muscleGroup, category: item.category, defaultResistanceType: item.defaultResistanceType })
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const total = results.length + (showAddOption ? 1 : 0)
    if (!open || total === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => (h + 1) % total)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => (h - 1 + total) % total)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted < results.length) {
        selectResult(results[highlighted])
      } else {
        onAddToLibrary(value)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => { if (value.trim()) setOpen(true) }}
        onKeyDown={handleKeyDown}
        placeholder="Exercise name *"
        className={`w-full text-xs border rounded px-1.5 py-1 ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
      />

      {open && (results.length > 0 || showAddOption) && (
        <div className="absolute left-0 top-full mt-0.5 w-56 bg-white border border-gray-200 rounded-md shadow-md z-50 overflow-auto max-h-48">
          {results.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={() => selectResult(item)}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full text-left px-3 py-2 border-b border-gray-100 last:border-b-0 ${i === highlighted ? 'bg-gray-50' : 'bg-white'}`}
            >
              <p className="text-xs font-medium text-gray-900">{item.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.muscleGroup} · {item.category} · {item.defaultResistanceType}</p>
            </button>
          ))}

          {showAddOption && (
            <button
              type="button"
              onMouseDown={() => { onAddToLibrary(value); setOpen(false) }}
              onMouseEnter={() => setHighlighted(results.length)}
              className={`w-full text-left px-3 py-2 border-t border-gray-100 ${highlighted === results.length ? 'bg-gray-50' : 'bg-white'}`}
            >
              <p className="text-xs font-medium text-blue-500 flex items-center gap-1">
                <span>+</span>
                <span>Add "{value}" to library</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Save as a new exercise</p>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
