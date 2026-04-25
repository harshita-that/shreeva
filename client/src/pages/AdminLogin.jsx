import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('aura_admin_auth') === 'true') {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Hardcoded credentials for demo
    if (username === 'admin' && password === 'aurajewels') {
      localStorage.setItem('aura_admin_auth', 'true')
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-[#C9A84C] bg-white p-8 sm:p-10">
        <h1 className="font-heading text-3xl font-bold text-dark text-center mb-2">Aura Jewels</h1>
        <p className="font-body text-xs uppercase tracking-widest text-[#C9A84C] text-center mb-8">Admin Panel</p>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-2.5">
            <p className="font-body text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors"
              placeholder="admin"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-dark text-[#FAFAF7] font-body uppercase tracking-widest text-xs hover:bg-[#C9A84C] hover:text-dark transition-colors duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-dark/40">
          Demo: admin / aurajewels
        </p>
      </div>
    </div>
  )
}
