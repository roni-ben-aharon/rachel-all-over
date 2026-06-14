import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from './hooks/useAuth'
import { useRole } from './hooks/useRole'
import { db } from './lib/firebase'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { TrainerDashboard } from './pages/TrainerDashboard'
import { ClientProgram } from './pages/ClientProgram'
import { ClientProgress } from './pages/ClientProgress'
import { WorkoutSession } from './pages/WorkoutSession'
import { Library } from './pages/Library'
import { Client } from './types'

function AppRoutes() {
  const { user, loading: authLoading } = useAuth()
  const { role, clientId, trainerId, loading: roleLoading } = useRole(user)

  const [trainerName, setTrainerName] = useState('')
  const [clientData, setClientData] = useState<Client | null>(null)
  const [clientTrainerName, setClientTrainerName] = useState('')

  useEffect(() => {
    if (role === 'trainer' && trainerId) {
      getDoc(doc(db, 'trainers', trainerId)).then(snap => {
        setTrainerName(snap.exists() ? (snap.data().name ?? '') : (user?.displayName ?? ''))
      })
    }
  }, [role, trainerId, user])

  useEffect(() => {
    if (role !== 'client' || !clientId) return
    getDoc(doc(db, 'clients', clientId)).then(snap => {
      if (!snap.exists()) return
      const c = { id: snap.id, ...snap.data() } as Client
      setClientData(c)
      if (c.trainerId) {
        getDoc(doc(db, 'trainers', c.trainerId)).then(tSnap => {
          setClientTrainerName(tSnap.exists() ? (tSnap.data().name ?? 'your trainer') : 'your trainer')
        })
      }
    })
  }, [role, clientId])

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (role === 'trainer') {
    return (
      <Routes>
        <Route path="/dashboard" element={
          <TrainerDashboard
            trainerId={trainerId ?? user.uid}
            trainerName={trainerName || user.displayName || user.email || 'Trainer'}
            trainerEmail={user.email ?? ''}
          />
        } />
        <Route path="/session/:clientId/:workoutId" element={
          <WorkoutSession trainerId={trainerId ?? user.uid} />
        } />
        <Route path="/library" element={
          <Library trainerId={trainerId ?? user.uid} />
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    )
  }

  if (role === 'client') {
    if (!clientData) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-gray-400">Loading your program...</p>
        </div>
      )
    }
    return (
      <Routes>
        <Route path="/my-program" element={
          <ClientProgram client={clientData} trainerName={clientTrainerName} />
        } />
        <Route path="/my-progress" element={
          <ClientProgress client={clientData} trainerName={clientTrainerName} />
        } />
        <Route path="*" element={<Navigate to="/my-program" replace />} />
      </Routes>
    )
  }

  // Role unresolved — fall back to login
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
