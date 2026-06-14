import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { WorkoutSession, Exercise } from '../types'

export function useLatestSession(workoutId: string | null) {
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(null)
    setLoading(true)
    if (!workoutId) { setLoading(false); return }

    const q = query(
      collection(db, 'workoutSessions'),
      where('workoutId', '==', workoutId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )
    getDocs(q).then(snap => {
      if (!snap.empty) {
        const doc = snap.docs[0]
        setSession({ id: doc.id, ...doc.data() } as WorkoutSession)
      }
      setLoading(false)
    })
  }, [workoutId])

  return { session, loading }
}

export function useClientSessions(clientId: string | null) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSessions([])
    setLoading(true)
    if (!clientId) { setLoading(false); return }

    const q = query(
      collection(db, 'workoutSessions'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    )
    getDocs(q).then(snap => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutSession)))
      setLoading(false)
    })
  }, [clientId])

  return { sessions, loading }
}

export async function saveSession(data: {
  workoutId: string
  clientId: string
  trainerId: string
  exercises: Exercise[]
}) {
  return addDoc(collection(db, 'workoutSessions'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export function formatSessionDate(createdAt: unknown): string {
  if (!createdAt) return ''
  const ts = createdAt as any
  const date = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function groupSessionsByWorkout(sessions: WorkoutSession[]): Record<string, WorkoutSession[]> {
  return sessions.reduce<Record<string, WorkoutSession[]>>((acc, s) => {
    if (!acc[s.workoutId]) acc[s.workoutId] = []
    acc[s.workoutId].push(s)
    return acc
  }, {})
}
