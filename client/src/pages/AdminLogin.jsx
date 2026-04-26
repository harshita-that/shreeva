import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios.js'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  // Already logged in → go straight to panel
  useEffect(() => {
    if (localStorage.getItem('shreeva_admin_token')) {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      // Store JWT token
      localStorage.setItem('shreeva_admin_token', res.data.token)
      localStorage.setItem('shreeva_admin_user', JSON.stringify(res.data.admin))
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-[#C9A84C] bg-white p-8 sm:p-10">
        <h1 className="font-heading text-3xl font-bold text-dark text-center mb-2">Shreeva Jewellers</h1>
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
            disabled={loading}
            className="w-full px-6 py-3 bg-dark text-[#FAFAF7] font-body uppercase tracking-widest text-xs hover:bg-[#C9A84C] hover:text-dark transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-dark/40">
          Use the credentials registered via <code>/api/auth/register</code>
        </p>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(201,168,76,0.15)', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(28,28,28,0.35)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,28,28,0.35)'}
          >
            ← Back to Shreeva Jewellers
          </Link>
        </div>
      </div>
    </div>
  )
}
