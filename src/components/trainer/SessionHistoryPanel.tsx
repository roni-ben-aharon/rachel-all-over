import { useState } from 'react'
import { useClientSessions, formatSessionDate, groupSessionsByWorkout } from '../../hooks/useSessions'
import { Workout } from '../../types'

interface Props {
  clientId: string
  clientName: string
  workouts: Workout[]
  onClose: () => void
}

export function SessionHistoryPanel({ clientId, clientName, workouts, onClose }: Props) {
  const { sessions, loading } = useClientSessions(clientId)
  const grouped = groupSessionsByWorkout(sessions)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleWorkout(wId: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(wId) ? next.delete(wId) : next.add(wId)
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-stretch justify-end" data-testid="session-history-panel">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-96 bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Session history</p>
            <p className="text-xs text-gray-500 mt-0.5">{clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            data-testid="close-history-panel"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="px-5 py-6 text-sm text-gray-400">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-400 italic" data-testid="no-sessions-msg">
              No sessions recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {workouts.map(w => {
                const wSessions = grouped[w.id] ?? []
                if (wSessions.length === 0) return null
                const isOpen = expanded.has(w.id)
                return (
                  <div key={w.id}>
                    <button
                      onClick={() => toggleWorkout(w.id)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 text-left"
                      data-testid={`history-workout-${w.id}`}
                    >
                      <span className="text-sm font-medium text-gray-800">{w.label}</span>
                      <span className="text-xs text-gray-400">{wSessions.length} session{wSessions.length !== 1 ? 's' : ''} {isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <ul className="px-5 pb-3 space-y-2 bg-gray-50">
                        {wSessions.map(s => (
                          <li key={s.id} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                            <span className="text-xs text-gray-700">{formatSessionDate(s.createdAt)}</span>
                            <span className="text-xs text-gray-400">{s.exercises.length} exercise{s.exercises.length !== 1 ? 's' : ''}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
