import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useActiveProgram, useWorkouts } from '../hooks/useWorkouts'
import { useLatestSession, formatSessionDate, saveSession } from '../hooks/useSessions'
import { WorkoutTableEdit } from '../components/trainer/WorkoutTableEdit'
import { WorkoutTable } from '../components/trainer/WorkoutTable'
import { SessionModal } from '../components/trainer/SessionModal'
import { useExerciseLibrary } from '../hooks/useExerciseLibrary'
import { Exercise, ResistanceType } from '../types'

interface Props {
  trainerId: string
}

function draftKey(workoutId: string) {
  return `tracklift:session:${workoutId}`
}

export function WorkoutSession({ trainerId }: Props) {
  const { clientId, workoutId } = useParams<{ clientId: string; workoutId: string }>()
  const navigate = useNavigate()

  const { program } = useActiveProgram(clientId ?? null)
  const { workouts } = useWorkouts(program?.id ?? null)
  const workout = workouts.find(w => w.id === workoutId)

  const { session: prevSession, loading: prevLoading } = useLatestSession(workoutId ?? null)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [initState, setInitState] = useState<'pending' | 'has-draft' | 'ready'>('pending')
  const [draftExercises, setDraftExercises] = useState<Exercise[]>([])
  const [prevExpanded, setPrevExpanded] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const initialized = useRef(false)

  const { addExercise: addToLibrary } = useExerciseLibrary()

  async function handleAddExercise(item: { name: string; muscleGroup: string; category: string; defaultResistanceType: ResistanceType }) {
    await addToLibrary({ ...item, trainerId })
  }

  useEffect(() => {
    if (!workout || !workoutId || initialized.current) return
    initialized.current = true

    const stored = localStorage.getItem(draftKey(workoutId))
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Exercise[]
        setDraftExercises(parsed)
        setInitState('has-draft')
        return
      } catch {
        localStorage.removeItem(draftKey(workoutId))
      }
    }

    setExercises(workout.exercises.map(ex => ({ ...ex })))
    setInitState('ready')
  }, [workout, workoutId])

  function resumeDraft() {
    setExercises(draftExercises)
    setIsDirty(true)
    setInitState('ready')
  }

  function discardDraft() {
    if (workoutId) localStorage.removeItem(draftKey(workoutId))
    setExercises(workout?.exercises.map(ex => ({ ...ex })) ?? [])
    setIsDirty(false)
    setInitState('ready')
  }

  function handleChange(updated: Exercise[]) {
    setExercises(updated)
    setIsDirty(true)
    if (workoutId) {
      localStorage.setItem(draftKey(workoutId), JSON.stringify(updated))
    }
  }

  async function handleSaveSession() {
    if (!workoutId || !clientId) return
    setSaving(true)
    try {
      await saveSession({ workoutId, clientId, trainerId, exercises })
      if (workoutId) localStorage.removeItem(draftKey(workoutId))
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Amber session banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Session in progress</span>
          {workout && (
            <h1 className="text-lg font-semibold text-gray-900 mt-0.5" data-testid="session-workout-label">
              {workout.label}
            </h1>
          )}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
          data-testid="cancel-session-btn"
        >
          ✕ Cancel
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Resume draft banner */}
        {initState === 'has-draft' && (
          <div
            data-testid="resume-draft-banner"
            className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
          >
            <p className="text-sm text-amber-800 font-medium">You have an unsaved draft from a previous session.</p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                data-testid="resume-draft-btn"
                onClick={resumeDraft}
                className="text-xs px-3 py-1.5 bg-amber-700 text-white rounded-md hover:bg-amber-800"
              >
                Resume
              </button>
              <button
                data-testid="discard-draft-btn"
                onClick={discardDraft}
                className="text-xs px-3 py-1.5 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-100"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Previous session section */}
        {!prevLoading && (
          <section data-testid="prev-session-section">
            {prevSession ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  data-testid="prev-session-toggle"
                  onClick={() => setPrevExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Previous session — {formatSessionDate(prevSession.createdAt)}
                  </span>
                  <span className="text-gray-400 text-xs">{prevExpanded ? '▲' : '▼'}</span>
                </button>
                {prevExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    <WorkoutTable label="" exercises={prevSession.exercises} headerless />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic" data-testid="no-prev-session">No previous sessions for this workout.</p>
            )}
          </section>
        )}

        {/* Today's session table */}
        {initState === 'ready' && (
          <section data-testid="today-session-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Today's session</h2>
              <span
                data-testid="change-indicator"
                className={`text-xs ${isDirty ? 'text-amber-600' : 'text-gray-400'}`}
              >
                {isDirty ? 'Unsaved changes' : 'No changes yet'}
              </span>
            </div>
            <WorkoutTableEdit exercises={exercises} onChange={handleChange} onAddExercise={handleAddExercise} />
          </section>
        )}

        {/* End session */}
        <div className="pt-4">
          <button
            data-testid="end-session-btn"
            onClick={() => setShowEndModal(true)}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            End session
          </button>
        </div>
      </div>

      {showEndModal && (
        <SessionModal
          onSave={handleSaveSession}
          onCancel={() => setShowEndModal(false)}
          saving={saving}
        />
      )}
    </div>
  )
}
