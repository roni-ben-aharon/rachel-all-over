import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { UserRole } from '../types'

interface RoleInfo {
  role: UserRole
  clientId: string | null
  trainerId: string | null
  loading: boolean
}

interface CachedRole {
  role: UserRole
  clientId: string | null
  trainerId: string | null
}

function cacheKey(uid: string) { return `tracklift:role:${uid}` }

function saveCache(uid: string, info: CachedRole) {
  try { localStorage.setItem(cacheKey(uid), JSON.stringify(info)) } catch {}
}

function loadCache(uid: string): CachedRole | null {
  try {
    const raw = localStorage.getItem(cacheKey(uid))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function useRole(user: User | null): RoleInfo {
  const [info, setInfo] = useState<RoleInfo>({ role: null, clientId: null, trainerId: null, loading: true })

  useEffect(() => {
    if (!user) {
      setInfo({ role: null, clientId: null, trainerId: null, loading: false })
      return
    }

    async function resolve() {
      // Try cache first — verify with getDoc (fast, single doc fetch)
      const cached = loadCache(user!.uid)
      if (cached) {
        if (cached.role === 'trainer' && cached.trainerId) {
          const snap = await getDoc(doc(db, 'trainers', cached.trainerId))
          if (snap.exists()) {
            setInfo({ role: 'trainer', clientId: null, trainerId: cached.trainerId, loading: false })
            return
          }
        }
        if (cached.role === 'client' && cached.clientId) {
          const snap = await getDoc(doc(db, 'clients', cached.clientId))
          if (snap.exists() && !snap.data().deleted) {
            setInfo({ role: 'client', clientId: cached.clientId, trainerId: null, loading: false })
            return
          }
        }
        // Cache stale — clear and fall through to email scan
        localStorage.removeItem(cacheKey(user!.uid))
      }

      // Email scan fallback (first login or stale cache)
      const trainersQ = query(collection(db, 'trainers'), where('email', '==', user!.email))
      const trainerSnap = await getDocs(trainersQ)
      if (!trainerSnap.empty) {
        const trainerId = trainerSnap.docs[0].id
        saveCache(user!.uid, { role: 'trainer', clientId: null, trainerId })
        setInfo({ role: 'trainer', clientId: null, trainerId, loading: false })
        return
      }
      const clientsQ = query(collection(db, 'clients'), where('email', '==', user!.email))
      const clientSnap = await getDocs(clientsQ)
      if (!clientSnap.empty) {
        const clientId = clientSnap.docs[0].id
        saveCache(user!.uid, { role: 'client', clientId, trainerId: null })
        setInfo({ role: 'client', clientId, trainerId: null, loading: false })
        return
      }
      setInfo({ role: 'client', clientId: null, trainerId: null, loading: false })
    }

    resolve()
  }, [user])

  return info
}
