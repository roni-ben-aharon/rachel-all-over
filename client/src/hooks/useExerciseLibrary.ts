import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { ExerciseLibraryItem, ResistanceType } from '../types'

export function useExerciseLibrary() {
  const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'exerciseLibrary'), orderBy('name'))
    const unsub = onSnapshot(q, snap => {
      setExercises(snap.docs.map(d => ({ id: d.id, ...d.data() } as ExerciseLibraryItem)))
      setLoading(false)
    })
    return unsub
  }, [])

  function search(input: string): ExerciseLibraryItem[] {
    if (!input.trim()) return []
    const lower = input.toLowerCase()
    return exercises.filter(ex => ex.name.toLowerCase().includes(lower)).slice(0, 5)
  }

  async function addExercise(item: {
    name: string
    muscleGroup: string
    category: string
    defaultResistanceType: ResistanceType
    trainerId: string
  }) {
    return addDoc(collection(db, 'exerciseLibrary'), {
      name: item.name,
      muscleGroup: item.muscleGroup,
      category: item.category,
      defaultResistanceType: item.defaultResistanceType,
      createdBy: item.trainerId,
      createdAt: serverTimestamp(),
    })
  }

  return { exercises, loading, search, addExercise }
}
