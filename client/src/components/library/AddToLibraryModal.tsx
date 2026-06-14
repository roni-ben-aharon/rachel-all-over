import { useState } from 'react'
import { ResistanceType } from '../../types'

interface Props {
  initialName: string
  onSkip: () => void
  onSave: (item: { name: string; muscleGroup: string; category: string; defaultResistanceType: ResistanceType }) => void
}

const RESISTANCE_OPTIONS: { value: ResistanceType; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'band', label: 'Band' },
  { value: 'bodyweight', label: 'Bodyweight' },
]

export function AddToLibraryModal({ initialName, onSkip, onSave }: Props) {
  const [name, setName] = useState(initialName)
  const [muscleGroup, setMuscleGroup] = useState('')
  const [category, setCategory] = useState('')
  const [resistanceType, setResistanceType] = useState<ResistanceType>('kg')

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), muscleGroup: muscleGroup.trim(), category: category.trim(), defaultResistanceType: resistanceType })
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Add to exercise library</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">"{initialName}" wasn't found — add it?</p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded px-2 py-1.5"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Muscle group</label>
              <input
                value={muscleGroup}
                onChange={e => setMuscleGroup(e.target.value)}
                placeholder="e.g. Back"
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Category</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Primary"
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Default type</label>
            <div className="flex gap-1.5">
              {RESISTANCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setResistanceType(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    resistanceType === opt.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md disabled:opacity-40"
          >
            Add to library
          </button>
        </div>
      </div>
    </div>
  )
}
