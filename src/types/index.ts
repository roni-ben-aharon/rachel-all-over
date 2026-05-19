export interface Trainer {
  id: string
  name: string
  email: string
}

export interface Client {
  id: string
  trainerId: string
  name: string
  email: string
  daysPerWeek: number
  deleted: boolean
  inviteAccepted: boolean
}

export interface Program {
  id: string
  clientId: string
  trainerId: string
  name: string
  active: boolean
  deleted: boolean
  createdAt: Date
}

export interface Workout {
  id: string
  programId: string
  clientId: string
  label: string
  order: number
  exercises: Exercise[]
  updatedAt?: unknown
}

export type ResistanceType = 'kg' | 'band' | 'bodyweight'

export interface Resistance {
  type: ResistanceType
  value?: number
  bandColor?: string
  assisted?: boolean
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  resistance: Resistance
  notes: string
  muscleGroup?: string
  category?: string
  technique?: string
}

export interface WorkoutSession {
  id: string
  workoutId: string
  clientId: string
  trainerId: string
  createdAt: unknown
  exercises: Exercise[]
}

export interface WorkoutVersion {
  id: string
  workoutId: string
  clientId: string
  createdAt: Date
  exercises: Exercise[]
}

export interface ExerciseLibraryItem {
  id: string
  name: string
  muscleGroup: string
  category: 'Primary' | 'Secondary' | 'Isolation'
  resistanceType: ResistanceType
  createdBy: 'system' | string
}

export interface Invite {
  id: string
  clientId: string
  trainerId: string
  email: string
  used: boolean
  createdAt: Date
  trainerName?: string
}

export type UserRole = 'trainer' | 'client' | null
