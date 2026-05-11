import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { Invite } from '../types'

const googleProvider = new GoogleAuthProvider()

export function Signup() {
  const [searchParams] = useSearchParams()
  const inviteId = searchParams.get('invite')
  const [invite, setInvite] = useState<Invite | null>(null)
  const [inviteError, setInviteError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!inviteId) { setInviteError('No invite link provided.'); return }
    getDoc(doc(db, 'invites', inviteId)).then(snap => {
      if (!snap.exists()) { setInviteError('Invalid invite link.'); return }
      const data = { id: snap.id, ...snap.data() } as Invite
      if (data.used) { setInviteError('This invite has already been used.'); return }
      setInvite(data)
      setEmail(data.email)
    })
  }, [inviteId])

  async function finishSignup(_uid: string, displayName: string, userEmail: string) {
    await setDoc(doc(db, 'clients', invite!.clientId), { inviteAccepted: true }, { merge: true })
    await updateDoc(doc(db, 'invites', inviteId!), { used: true })
    await setDoc(doc(db, 'clients', invite!.clientId), { name: displayName, email: userEmail }, { merge: true })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!invite) return
    setError('')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      await finishSignup(cred.user.uid, name, email)
      navigate('/my-program')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!invite) return
    setError('')
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await finishSignup(cred.user.uid, cred.user.displayName ?? '', cred.user.email ?? '')
      navigate('/my-program')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 w-72">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-gray-900 flex items-center justify-center text-2xl" style={{ width: 52, height: 52 }}>🏋️</div>
          <p className="text-xl font-semibold">RachelAllOver</p>
        </div>
        <div className="w-full border border-gray-200 rounded-xl p-6 flex flex-col gap-3 bg-white">
          {inviteError ? (
            <p className="text-sm text-red-500 text-center">{inviteError}</p>
          ) : (
            <>
              {invite && (
                <div className="bg-blue-50 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                    {(invite.trainerName ?? 'T').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-700">{invite.trainerName ?? 'Your trainer'} invited you</p>
                    <p className="text-xs text-blue-500">Create your account to get started</p>
                  </div>
                </div>
              )}
              <p className="text-sm font-medium text-center">Create your account</p>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" required />
                <input type="email" value={email} disabled
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-100 text-gray-400 cursor-not-allowed" />
                <input type="password" placeholder="Choose a password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" required />
                <button type="submit" disabled={loading || !invite}
                  className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-md disabled:opacity-50">
                  Create account
                </button>
              </form>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button onClick={handleGoogle} disabled={loading || !invite}
                className="flex items-center justify-center gap-2 w-full py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50">
                <GoogleIcon />
                Sign up with Google
              </button>
            </>
          )}
          <p className="text-xs text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
