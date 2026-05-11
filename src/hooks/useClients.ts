import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Client } from '../types'

export function useClients(trainerId: string | null) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!trainerId) { setLoading(false); return }
    const q = query(collection(db, 'clients'), where('trainerId', '==', trainerId), where('deleted', '==', false))
    const unsub = onSnapshot(q, snap => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)))
      setLoading(false)
    })
    return unsub
  }, [trainerId])

  return { clients, loading }
}
