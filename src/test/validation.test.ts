import { describe, it, expect } from 'vitest'
import { Exercise } from '../types'

// --- Exercise validation ---

function hasUnnamedExercises(exercises: Exercise[]): boolean {
  return exercises.some(ex => !ex.name.trim())
}

const makeExercise = (name: string): Exercise => ({
  name,
  sets: 3,
  reps: '10',
  resistance: { type: 'kg', value: 0 },
  notes: '',
})

describe('exercise validation', () => {
  it('passes when all exercises have names', () => {
    const exercises = [makeExercise('Squat'), makeExercise('Deadlift')]
    expect(hasUnnamedExercises(exercises)).toBe(false)
  })

  it('fails when any exercise has empty name', () => {
    const exercises = [makeExercise('Squat'), makeExercise('')]
    expect(hasUnnamedExercises(exercises)).toBe(true)
  })

  it('fails when name is only whitespace', () => {
    const exercises = [makeExercise('   ')]
    expect(hasUnnamedExercises(exercises)).toBe(true)
  })

  it('passes for empty exercise list', () => {
    expect(hasUnnamedExercises([])).toBe(false)
  })
})

// --- Email normalization ---

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

describe('email normalization', () => {
  it('lowercases email', () => {
    expect(normalizeEmail('RACHEL@TEST.COM')).toBe('rachel@test.com')
  })

  it('trims whitespace', () => {
    expect(normalizeEmail('  rachel@test.com  ')).toBe('rachel@test.com')
  })

  it('handles both', () => {
    expect(normalizeEmail('  RACHEL@TEST.COM  ')).toBe('rachel@test.com')
  })
})

// --- Workout label generation ---

const WORKOUT_LABELS = ['Workout A', 'Workout B', 'Workout C', 'Workout D', 'Workout E']

function getWorkoutLabels(daysPerWeek: number): string[] {
  return WORKOUT_LABELS.slice(0, Math.min(daysPerWeek, 5))
}

describe('workout label generation', () => {
  it('generates correct count for 3x/week', () => {
    const labels = getWorkoutLabels(3)
    expect(labels).toHaveLength(3)
    expect(labels).toEqual(['Workout A', 'Workout B', 'Workout C'])
  })

  it('caps at 5 even if daysPerWeek > 5', () => {
    const labels = getWorkoutLabels(7)
    expect(labels).toHaveLength(5)
  })

  it('handles 1x/week', () => {
    expect(getWorkoutLabels(1)).toEqual(['Workout A'])
  })
})
