import { Exercise } from '../types'

interface WorkoutTemplate {
  label: string
  exercises: Exercise[]
}

function emptyExercises(count: number): Exercise[] {
  return Array.from({ length: count }, () => ({
    name: '',
    sets: 3,
    reps: '10',
    resistance: { type: 'bodyweight' as const },
    notes: '',
  }))
}

export function getTemplate(daysPerWeek: number): WorkoutTemplate[] {
  if (daysPerWeek <= 2) {
    return [
      { label: 'Workout A', exercises: emptyExercises(6) },
      { label: 'Workout B', exercises: emptyExercises(6) },
    ]
  }
  if (daysPerWeek === 3) {
    return [
      { label: 'Workout A', exercises: emptyExercises(7) },
      { label: 'Workout B', exercises: emptyExercises(7) },
    ]
  }
  if (daysPerWeek === 4) {
    return [
      { label: 'Workout A', exercises: emptyExercises(6) },
      { label: 'Workout B', exercises: emptyExercises(6) },
      { label: 'Workout C', exercises: emptyExercises(6) },
      { label: 'Workout D', exercises: emptyExercises(6) },
    ]
  }
  // 5+
  return [
    { label: 'Workout A', exercises: emptyExercises(6) },
    { label: 'Workout B', exercises: emptyExercises(6) },
    { label: 'Workout C', exercises: emptyExercises(6) },
    { label: 'Workout D', exercises: emptyExercises(6) },
    { label: 'Workout E', exercises: emptyExercises(5) },
  ]
}

export function templateDescription(daysPerWeek: number): string {
  if (daysPerWeek <= 2) return '2 workouts · 6 exercises each'
  if (daysPerWeek === 3) return '2 workouts · 7 exercises each'
  if (daysPerWeek === 4) return '4 workouts · 6 exercises each'
  return '5 workouts · 5–6 exercises each'
}
