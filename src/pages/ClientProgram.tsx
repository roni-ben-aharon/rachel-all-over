import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useActiveProgram, useWorkouts } from '../hooks/useWorkouts'
import { WorkoutTable } from '../components/trainer/WorkoutTable'
import { Client, Exercise } from '../types'

interface Props {
  client: Client
  trainerName: string
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WorkoutCard({ label, exercises }: { label: string; exercises: Exercise[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div data-testid="client-workout-card" className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-2.5 border-b border-gray-200 flex items-center gap-2 bg-gray-50 text-left"
      >
        <ChevronIcon open={open} />
        <p className="text-xs font-medium flex-1">{label}</p>
        <span className="text-xs text-gray-400">{exercises.length} exercises</span>
      </button>
      {open && <WorkoutTable label="" exercises={exercises} headerless />}
    </div>
  )
}

export function ClientProgram({ client, trainerName }: Props) {
  const { program } = useActiveProgram(client.id)
  const { workouts } = useWorkouts(program?.id ?? null)

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-500">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">Hey, {client.name}</p>
            <p className="text-xs text-gray-400">
              {program?.name ?? 'No program'} · with {trainerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md">
            My program
          </button>
          <button
            onClick={() => signOut(auth)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Workout cards — read-only */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {workouts.map(w => (
          <WorkoutCard key={w.id} label={w.label} exercises={w.exercises} />
        ))}
        {workouts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Your trainer hasn't set up your program yet.
          </p>
        )}
      </div>
    </div>
  )
}
