import { useState, useEffect } from 'react'
import { doc, updateDoc, addDoc, deleteDoc, collection, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../lib/firebase'
import { useClients } from '../hooks/useClients'
import { useActiveProgram, useWorkouts } from '../hooks/useWorkouts'
import { WorkoutTable } from '../components/trainer/WorkoutTable'
import { WorkoutTableEdit } from '../components/trainer/WorkoutTableEdit'
import { AddClientModal } from '../components/trainer/AddClientModal'
import { Exercise, Workout } from '../types'

const WORKOUT_LABELS = ['Workout A', 'Workout B', 'Workout C', 'Workout D', 'Workout E']

function tsToDate(d: unknown): Date {
  if (d instanceof Date) return d
  const ts = d as any
  return new Date(ts?.seconds ? ts.seconds * 1000 : 0)
}

function Avatar({ name, active }: { name: string; active?: boolean }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${active ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WorkoutCard({
  workout, editMode, draft, persisted, onDraftChange, onDelete,
}: {
  workout: Workout
  editMode: boolean
  draft: Exercise[] | null
  persisted: Exercise[] | null
  onDraftChange: (workoutId: string, exercises: Exercise[]) => void
  onDelete: (workoutId: string) => void
}) {
  const [open, setOpen] = useState(true)

  // Priority: Firestore snapshot > persisted save > draft > empty
  const exercises = editMode
    ? (draft ?? workout.exercises)
    : (workout.exercises.length > 0 ? workout.exercises : (persisted ?? draft ?? []))

  return (
    <div data-testid="workout-card" className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          <ChevronIcon open={open} />
          <p className="text-xs font-medium">{workout.label}</p>
          <span className="text-xs text-gray-400">{exercises.length} exercises</span>
        </button>
        {editMode && (
          <button
            onClick={() => onDelete(workout.id)}
            className="ml-3 text-xs text-red-400 hover:text-red-600 px-1"
            title="Remove workout"
          >
            🗑
          </button>
        )}
      </div>
      {open && (
        editMode ? (
          <div className="p-4">
            <WorkoutTableEdit
              exercises={exercises}
              onChange={exs => onDraftChange(workout.id, exs)}
            />
          </div>
        ) : (
          <WorkoutTable label="" exercises={exercises} headerless />
        )
      )}
    </div>
  )
}

interface Props {
  trainerId: string
  trainerName: string
  trainerEmail: string
}

export function TrainerDashboard({ trainerId, trainerName }: Props) {
  const { clients } = useClients(trainerId)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showNewProgramModal, setShowNewProgramModal] = useState(false)
  const [newProgramName, setNewProgramName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [draftExercises, setDraftExercises] = useState<Record<string, Exercise[]>>({})
  const [persistedExercises, setPersistedExercises] = useState<Record<string, Exercise[]>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const selectedClient = clients.find(c => c.id === selectedClientId) ?? clients[0] ?? null
  const activeClientId = selectedClient?.id ?? null

  const { program } = useActiveProgram(activeClientId)
  const { workouts, loading: workoutsLoading, loadedFor: workoutsLoadedFor } = useWorkouts(program?.id ?? null)

  // Seed missing workout slots when a program first loads with no workouts.
  // Fires only when workoutsLoadedFor changes (i.e. when we switch to a different program),
  // so it never re-runs when an existing workout is deleted or when daysPerWeek is updated.
  useEffect(() => {
    if (!program || !selectedClient) return
    if (program.clientId !== selectedClient.id) return
    if (workoutsLoadedFor !== program.id) return  // snapshot not yet arrived for this program
    if (workouts.length > 0) return               // already has workouts — nothing to seed
    const expected = Math.min(selectedClient.daysPerWeek, 5)
    for (let i = 0; i < expected; i++) {
      addDoc(collection(db, 'workouts'), {
        programId: program.id,
        clientId: selectedClient.id,
        label: WORKOUT_LABELS[i],
        order: i,
        exercises: [],
      })
    }
  // Only re-run when we switch programs (workoutsLoadedFor changes).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutsLoadedFor])


  const lastUpdated = workouts
    .filter(w => w.updatedAt)
    .map(w => tsToDate(w.updatedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const lastUpdatedStr = lastUpdated
    ? lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  function startEdit() {
    const draft: Record<string, Exercise[]> = {}
    workouts.forEach(w => { draft[w.id] = [...w.exercises] })
    setDraftExercises(draft)
    setEditMode(true)
  }

  function cancelEdit() {
    setEditMode(false)
    setDraftExercises({})
  }

  function updateDraft(workoutId: string, exercises: Exercise[]) {
    setDraftExercises(prev => ({ ...prev, [workoutId]: exercises }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      for (const w of workouts) {
        const exercises = draftExercises[w.id] ?? w.exercises
        const unnamed = exercises.filter(ex => !ex.name.trim())
        if (unnamed.length > 0) {
          setSaveError(`${w.label}: all exercises need a name`)
          setSaving(false)
          return
        }
        const badReps = exercises.find(ex => !/^\d+$/.test(ex.reps?.trim() ?? '') || parseInt(ex.reps) <= 0)
        if (badReps) {
          setSaveError(`${w.label}: reps must be a whole number (e.g. 10)`)
          setSaving(false)
          return
        }
        await updateDoc(doc(db, 'workouts', w.id), { exercises, updatedAt: serverTimestamp() })
      }
      // Persist exercises locally so they survive client switches even before onSnapshot re-fires
      const saved: Record<string, Exercise[]> = {}
      for (const w of workouts) {
        saved[w.id] = draftExercises[w.id] ?? w.exercises
      }
      setPersistedExercises(prev => ({ ...prev, ...saved }))
      setEditMode(false)
      // Don't clear draftExercises here — WorkoutCard uses draft as fallback until onSnapshot fires
    } catch (err: any) {
      setSaveError(err?.message ?? 'Save failed')
    }
    setSaving(false)
  }

  async function handleAddWorkout() {
    if (!program || !selectedClient || !activeClientId) return
    if (workouts.length >= 5) return
    const newOrder = workouts.length
    await addDoc(collection(db, 'workouts'), {
      programId: program.id,
      clientId: activeClientId,
      label: WORKOUT_LABELS[newOrder],
      order: newOrder,
      exercises: [],
    })
    await updateDoc(doc(db, 'clients', activeClientId), { daysPerWeek: workouts.length + 1 })
  }

  async function handleDeleteWorkout(workoutId: string) {
    if (!activeClientId || !selectedClient) return
    await deleteDoc(doc(db, 'workouts', workoutId))
    const newDays = Math.max(1, selectedClient.daysPerWeek - 1)
    await updateDoc(doc(db, 'clients', activeClientId), { daysPerWeek: newDays })
    setDraftExercises(prev => { const next = { ...prev }; delete next[workoutId]; return next })
    setPersistedExercises(prev => { const next = { ...prev }; delete next[workoutId]; return next })
  }

  async function handleNewProgram() {
    if (!newProgramName.trim() || !activeClientId || !selectedClient) return
    if (program) await updateDoc(doc(db, 'programs', program.id), { active: false })
    const programRef = await addDoc(collection(db, 'programs'), {
      clientId: activeClientId, trainerId,
      name: newProgramName.trim(),
      active: true, deleted: false, createdAt: serverTimestamp(),
    })
    const count = Math.min(selectedClient.daysPerWeek, 5)
    for (let i = 0; i < count; i++) {
      await addDoc(collection(db, 'workouts'), {
        programId: programRef.id, clientId: activeClientId,
        label: WORKOUT_LABELS[i], order: i, exercises: [],
      })
    }
    setShowNewProgramModal(false)
    setNewProgramName('')
    setEditMode(false)
    setDraftExercises({})
  }

  async function handleDeleteClient() {
    if (!activeClientId) return
    await updateDoc(doc(db, 'clients', activeClientId), { deleted: true })
    setSelectedClientId(null)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-[200px] border-r border-gray-200 flex flex-col bg-gray-50 flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-xs font-medium">{trainerName}'s clients</p>
          <p className="text-xs text-gray-400 mt-0.5">{clients.length} active</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {clients.map(c => {
            const isActive = c.id === selectedClient?.id
            return (
              <button
                key={c.id}
                onClick={() => { setSelectedClientId(c.id); setEditMode(false); setDraftExercises({}) }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 text-left ${isActive ? 'bg-white border border-gray-200' : 'hover:bg-gray-100'}`}
              >
                <Avatar name={c.name} active={isActive} />
                <div>
                  <p className={`text-xs ${isActive ? 'font-medium' : ''}`}>{c.name}</p>
                  <p className="text-xs text-gray-400">{c.daysPerWeek}x / week</p>
                </div>
              </button>
            )
          })}
        </div>
        <div className="p-2 border-t border-gray-200 flex flex-col gap-1">
          <button
            onClick={() => setShowAddClient(true)}
            className="w-full text-xs py-1.5 border border-gray-200 rounded-md hover:bg-gray-100"
          >
            + Add client
          </button>
          <button
            onClick={() => signOut(auth)}
            className="w-full text-xs py-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedClient ? (
          <>
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-500">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{selectedClient.name}</p>
                  <p className="text-xs text-gray-400">
                    {program?.name ?? 'No program'} · {selectedClient.daysPerWeek}x / week
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saveError && (
                  <p className="text-xs text-red-500 max-w-xs truncate" title={saveError}>{saveError}</p>
                )}
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save program'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEdit}
                      className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md"
                    >
                      Edit program
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(m => !m)}
                        className="text-sm px-3 py-1.5 border border-gray-200 rounded-md"
                      >
                        ···
                      </button>
                      {showMenu && (
                        <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-44 py-1">
                          <button
                            onClick={() => { setShowNewProgramModal(true); setShowMenu(false) }}
                            className="w-full text-left text-xs px-4 py-2 hover:bg-gray-50"
                          >
                            New program
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => { setShowDeleteConfirm(true); setShowMenu(false) }}
                            className="w-full text-left text-xs px-4 py-2 hover:bg-gray-50 text-red-500"
                          >
                            Delete client
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Workout cards */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {workouts.map(w => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  editMode={editMode}
                  draft={draftExercises[w.id] ?? null}
                  persisted={persistedExercises[w.id] ?? null}
                  onDraftChange={updateDraft}
                  onDelete={handleDeleteWorkout}
                />
              ))}
              {workouts.length === 0 && !editMode && (
                <p className="text-xs text-gray-400 text-center py-8">No workouts yet</p>
              )}
              {editMode && workouts.length < 5 && (
                <button
                  onClick={handleAddWorkout}
                  className="w-full text-xs py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700"
                >
                  + Add workout
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                {lastUpdatedStr ? `Last updated: ${lastUpdatedStr}` : 'Not yet saved'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
            Select a client or add one to get started
          </div>
        )}
      </div>

      {showAddClient && (
        <AddClientModal
          trainerId={trainerId}
          trainerName={trainerName}
          onClose={() => setShowAddClient(false)}
          onCreated={clientId => setSelectedClientId(clientId)}
        />
      )}

      {showNewProgramModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-72 shadow-xl p-5 flex flex-col gap-3">
            <p className="text-sm font-medium">New program</p>
            <input
              value={newProgramName}
              onChange={e => setNewProgramName(e.target.value)}
              placeholder="Program name"
              className="text-sm border border-gray-200 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-400">Current program will be archived.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewProgramModal(false)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProgram}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-72 shadow-xl p-5 flex flex-col gap-3">
            <p className="text-sm font-medium">Delete {selectedClient?.name}?</p>
            <p className="text-xs text-gray-400">
              This will remove them from your client list.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
