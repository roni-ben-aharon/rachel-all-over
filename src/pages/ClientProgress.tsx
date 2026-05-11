import { useNavigate } from 'react-router-dom'
import { useActiveProgram, useWorkouts } from '../hooks/useWorkouts'
import { useAllWorkoutVersions } from '../hooks/useWorkoutVersions'
import { ProgressChart } from '../components/client/ProgressChart'
import { Client, WorkoutVersion } from '../types'

interface Props {
  client: Client
  trainerName: string
}

function AllVersionsProvider({ workoutIds, children }: { workoutIds: string[]; children: (versions: WorkoutVersion[]) => React.ReactNode }) {
  const v0 = useAllWorkoutVersions(workoutIds[0] ?? null).versions
  const v1 = useAllWorkoutVersions(workoutIds[1] ?? null).versions
  const v2 = useAllWorkoutVersions(workoutIds[2] ?? null).versions
  const v3 = useAllWorkoutVersions(workoutIds[3] ?? null).versions
  return <>{children([...v0, ...v1, ...v2, ...v3])}</>
}

export function ClientProgress({ client, trainerName }: Props) {
  const navigate = useNavigate()
  const { program } = useActiveProgram(client.id)
  const { workouts } = useWorkouts(program?.id ?? null)

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-500">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">Hey, {client.name}</p>
            <p className="text-xs text-gray-400">{program?.name ?? 'No program'} · with {trainerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/my-program')} className="text-xs px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50">My program</button>
          <button className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md">My progress</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <AllVersionsProvider workoutIds={workouts.map(w => w.id)}>
          {versions => <ProgressChart versions={versions} />}
        </AllVersionsProvider>
      </div>
    </div>
  )
}
