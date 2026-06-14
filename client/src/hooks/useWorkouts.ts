import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Exercise, Program, Workout } from '../types'

export function useActiveProgram(clientId: string | null) {
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProgram(null)
    setLoading(true)
    if (!clientId) { setLoading(false); return }
    const q = query(collection(db, 'programs'), where('clientId', '==', clientId), where('active', '==', true), where('deleted', '==', false))
    const unsub = onSnapshot(q, snap => {
      setProgram(snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Program))
      setLoading(false)
    })
    return unsub
  }, [clientId])

  return { program, loading }
}

export function useWorkouts(programId: string | null) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  // Track which programId the current workouts snapshot belongs to.
  // This prevents auto-create from firing while the first snapshot is in flight.
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  useEffect(() => {
    setWorkouts([])
    setLoading(true)
    setLoadedFor(null)
    if (!programId) { setLoading(false); return }
    const q = query(collection(db, 'workouts'), where('programId', '==', programId), orderBy('order'))
    const unsub = onSnapshot(q, snap => {
      setWorkouts(snap.docs.map(d => ({ exercises: [] as Exercise[], ...d.data(), id: d.id } as unknown as Workout)))
      setLoading(false)
      setLoadedFor(programId)
    })
    return unsub
  }, [programId])

  return { workouts, loading, loadedFor }
}
