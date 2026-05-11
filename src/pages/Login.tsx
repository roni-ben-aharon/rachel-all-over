import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'

const googleProvider = new GoogleAuthProvider()

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err: any) {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 w-72">
        <div className="flex flex-col items-center gap-2">
          <div className="w-13 h-13 rounded-2xl bg-gray-900 flex items-center justify-center text-2xl" style={{ width: 52, height: 52 }}>🏋️</div>
          <p className="text-xl font-semibold">RachelAllOver</p>
          <p className="text-xs text-gray-400 text-center">Track your progress. See what's working.</p>
        </div>
        <div className="w-full border border-gray-200 rounded-xl p-6 flex flex-col gap-3 bg-white">
          <p className="text-sm font-medium text-center">Welcome back</p>
          <p className="text-xs text-gray-400 text-center -mt-1">Sign in to access your workouts</p>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-2" required />
            <button type="submit" disabled={loading}
              className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-md disabled:opacity-50">
              Sign in
            </button>
          </form>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button onClick={handleGoogle} disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50">
            <GoogleIcon />
            Continue with Google
          </button>
          <p className="text-xs text-gray-400 text-center">Your role is assigned automatically based on your account.</p>
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
