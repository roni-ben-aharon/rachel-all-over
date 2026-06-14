import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExerciseLibrary } from '../hooks/useExerciseLibrary'
import { AddToLibraryModal } from '../components/library/AddToLibraryModal'
import { ExerciseLibraryItem, ResistanceType } from '../types'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const PAGE_SIZE = 20

interface Props {
  trainerId: string
}

function ResistancePill({ value }: { value: ResistanceType }) {
  const labels: Record<ResistanceType, string> = { kg: 'kg', band: 'Band', bodyweight: 'BW' }
  return <span className="text-[11px] text-gray-400">{labels[value]}</span>
}

function InlineEditRow({
  item,
  onSave,
  onCancel,
}: {
  item: ExerciseLibraryItem
  onSave: (patch: Partial<ExerciseLibraryItem>) => void
  onCancel: () => void
}) {
  const [muscleGroup, setMuscleGroup] = useState(item.muscleGroup)
  const [category, setCategory] = useState(item.category)
  const [resistanceType, setResistanceType] = useState<ResistanceType>(item.defaultResistanceType)
  const isSystem = item.createdBy === 'system'

  return (
    <tr className="border-t border-gray-100 bg-blue-50/30">
      <td className="px-3 py-2">
        {isSystem ? (
          <span className="text-xs text-gray-500">{item.name}</span>
        ) : (
          <input
            defaultValue={item.name}
            id={`edit-name-${item.id}`}
            className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full"
          />
        )}
      </td>
      <td className="px-3 py-2">
        <input
          value={muscleGroup}
          onChange={e => setMuscleGroup(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full"
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full"
        />
      </td>
      <td className="px-3 py-2">
        <select
          value={resistanceType}
          onChange={e => setResistanceType(e.target.value as ResistanceType)}
          className="text-xs border border-gray-200 rounded px-1.5 py-1"
        >
          <option value="kg">kg</option>
          <option value="band">Band</option>
          <option value="bodyweight">Bodyweight</option>
        </select>
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              const nameEl = document.getElementById(`edit-name-${item.id}`) as HTMLInputElement | null
              const name = nameEl ? nameEl.value.trim() || item.name : item.name
              onSave({ name, muscleGroup: muscleGroup.trim() || item.muscleGroup, category: category.trim() || item.category, defaultResistanceType: resistanceType })
            }}
            className="text-xs px-2 py-0.5 bg-gray-900 text-white rounded"
          >
            Save
          </button>
          <button onClick={onCancel} className="text-xs px-2 py-0.5 border border-gray-200 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export function Library({ trainerId }: Props) {
  const navigate = useNavigate()
  const { exercises, loading, addExercise } = useExerciseLibrary()

  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  const muscleGroups = ['All', ...Array.from(new Set(exercises.map(e => e.muscleGroup))).sort()]

  const filtered = exercises.filter(e => {
    const matchGroup = filterGroup === 'All' || e.muscleGroup === filterGroup
    const matchSearch = !search.trim() || e.name.toLowerCase().includes(search.toLowerCase())
    return matchGroup && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange(group: string) {
    setFilterGroup(group)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  async function handleSaveEdit(item: ExerciseLibraryItem, patch: Partial<ExerciseLibraryItem>) {
    await updateDoc(doc(db, 'exerciseLibrary', item.id), patch as Record<string, unknown>)
    setEditingId(null)
  }

  async function handleAddNew(newItem: { name: string; muscleGroup: string; category: string; defaultResistanceType: ResistanceType }) {
    await addExercise({ ...newItem, trainerId })
    setShowAddModal(false)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar stub — back to dashboard */}
      <div className="w-[200px] border-r border-gray-200 flex flex-col bg-gray-50 flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-xs font-medium">Exercise library</p>
          <p className="text-xs text-gray-400 mt-0.5">{exercises.length} exercises</p>
        </div>
        <div className="flex-1" />
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-xs py-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Exercise library</h1>
            <span className="text-xs text-gray-400">{filtered.length} exercises</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search exercises..."
              className="text-xs border border-gray-200 rounded px-2.5 py-1.5 w-48"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md"
            >
              + Add exercise
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-5 py-2 border-b border-gray-100 flex gap-1.5 overflow-x-auto flex-shrink-0">
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => handleFilterChange(group)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap border transition-colors ${
                filterGroup === group
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-12">Loading...</p>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-gray-400 w-[35%]">Exercise</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-400 w-[20%]">Muscle group</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-400 w-[20%]">Category</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-400 w-[12%]">Resistance</th>
                  <th className="w-[13%]" />
                </tr>
              </thead>
              <tbody>
                {paginated.map(item =>
                  editingId === item.id ? (
                    <InlineEditRow
                      key={item.id}
                      item={item}
                      onSave={patch => handleSaveEdit(item, patch)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{item.name}</td>
                      <td className="px-3 py-2 text-gray-500">{item.muscleGroup}</td>
                      <td className="px-3 py-2 text-gray-500">{item.category}</td>
                      <td className="px-3 py-2"><ResistancePill value={item.defaultResistanceType} /></td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-xs text-gray-400 hover:text-gray-700 px-1"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-xs text-gray-400">
                      No exercises found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <p className="text-xs text-gray-400">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs px-2.5 py-1 border border-gray-200 rounded disabled:opacity-30 hover:bg-gray-50"
              >
                ←
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-xs px-2.5 py-1 border border-gray-200 rounded disabled:opacity-30 hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToLibraryModal
          initialName=""
          onSkip={() => setShowAddModal(false)}
          onSave={handleAddNew}
        />
      )}
    </div>
  )
}
