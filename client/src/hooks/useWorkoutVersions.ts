import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { WorkoutVersion } from '../types'

export function useLatestWorkoutVersion(workoutId: string | null) {
  const [version, setVersion] = useState<WorkoutVersion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workoutId) { setLoading(false); return }
    const q = query(collection(db, 'workoutVersions'), where('workoutId', '==', workoutId), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setVersion(snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as WorkoutVersion))
      setLoading(false)
    })
    return unsub
  }, [workoutId])

  return { version, loading }
}

export function useAllWorkoutVersions(workoutId: string | null) {
  const [versions, setVersions] = useState<WorkoutVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workoutId) { setLoading(false); return }
    const q = query(collection(db, 'workoutVersions'), where('workoutId', '==', workoutId), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setVersions(snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutVersion)))
      setLoading(false)
    })
    return unsub
  }, [workoutId])

  return { versions, loading }
}
