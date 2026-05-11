import { useState } from 'react'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface AddClientModalProps {
  trainerId: string
  trainerName: string
  onClose: () => void
  onCreated: (clientId: string) => void
}

const WORKOUT_LABELS = ['Workout A', 'Workout B', 'Workout C', 'Workout D', 'Workout E']

export function AddClientModal({ trainerId, trainerName, onClose, onCreated }: AddClientModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [programName, setProgramName] = useState('')
  const [daysPerWeek, setDaysPerWeek] = useState(3)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    if (!fullName || !email.trim()) { setError('Name and email required'); return }
    const normalizedEmail = email.trim().toLowerCase()
    setSaving(true)
    try {
      const dupQ = query(collection(db, 'clients'), where('trainerId', '==', trainerId), where('email', '==', normalizedEmail), where('deleted', '==', false))
      const dupSnap = await getDocs(dupQ)
      if (!dupSnap.empty) { setError('Client with this email already exists'); setSaving(false); return }

      const clientRef = await addDoc(collection(db, 'clients'), {
        trainerId,
        name: fullName,
        email: normalizedEmail,
        daysPerWeek,
        deleted: false,
        inviteAccepted: false,
      })
      const programRef = await addDoc(collection(db, 'programs'), {
        clientId: clientRef.id,
        trainerId,
        name: programName.trim() || 'Program 1',
        active: true,
        deleted: false,
        createdAt: serverTimestamp(),
      })
      const count = Math.min(daysPerWeek, 5)
      for (let i = 0; i < count; i++) {
        await addDoc(collection(db, 'workouts'), {
          programId: programRef.id,
          clientId: clientRef.id,
          label: WORKOUT_LABELS[i],
          order: i,
          exercises: [],
        })
      }
      const inviteRef = await addDoc(collection(db, 'invites'), {
        clientId: clientRef.id,
        trainerId,
        email: normalizedEmail,
        used: false,
        createdAt: serverTimestamp(),
        trainerName,
      })
      const link = `${window.location.origin}/signup?invite=${inviteRef.id}`
      setInviteLink(link)
      onCreated(clientRef.id)
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  function copyLink() {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium">{inviteLink ? 'Client created!' : 'Add new client'}</p>
          <button onClick={onClose} className="text-gray-400 text-lg leading-none">×</button>
        </div>

        {inviteLink ? (
          /* Step 2 — invite link */
          <div className="p-5 flex flex-col gap-4">
            <p className="text-xs text-gray-500">
              Share this invite link with <span className="font-medium text-gray-800">{firstName} {lastName}</span> so they can create their account:
            </p>
            <div className="flex gap-2">
              <input
                data-testid="invite-link-input"
                value={inviteLink}
                readOnly
                className="flex-1 text-xs border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-600 truncate"
              />
              <button
                onClick={copyLink}
                className="text-xs px-3 py-2 bg-gray-900 text-white rounded-md whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400">The link expires once used.</p>
            <button
              onClick={onClose}
              className="w-full text-sm py-2 bg-gray-900 text-white rounded-md"
            >
              Done
            </button>
          </div>
        ) : (
          /* Step 1 — client form */
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-3">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">First name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="First" className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Last name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Last" className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="client@email.com"
                className="text-sm border border-gray-200 rounded-md px-3 py-2" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Program name</label>
              <input value={programName} onChange={e => setProgramName(e.target.value)}
                placeholder="e.g. Strength Phase 1"
                className="text-sm border border-gray-200 rounded-md px-3 py-2" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Workouts per week</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setDaysPerWeek(n)}
                    className={`flex-1 py-2 text-sm rounded-md border transition-colors ${
                      daysPerWeek === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3.5 flex gap-2 justify-end">
              <button type="button" onClick={onClose}
                className="text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="text-sm px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50">
                {saving ? 'Creating...' : 'Create client'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
