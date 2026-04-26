import { useEffect, useState } from 'react'
import api from '../api/axios.js'

export default function GoldRateTicker() {
  const [rate, setRate]           = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  /* ── EXISTING FETCH LOGIC — UNTOUCHED ── */
  useEffect(() => {
    const fetchRate = () => {
      api.get('/gold-price').then(res => {
        const data = res.data.data || res.data
        setRate(data.pricePerGram ?? data.price_per_gram)
        setUpdatedAt(data.updatedAt ?? data.updated_at)
      }).catch(console.error)
    }
    fetchRate()
    const interval = setInterval(fetchRate, 10000)
    return () => clearInterval(interval)
  }, [])
  /* ── END EXISTING LOGIC ── */

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  const timeAgo = (dateString) => {
    if (!dateString) return ''
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
    if (diff < 60)   return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  /* Don't render the bar at all until we have data — prevents empty gap */
  if (!rate) return null

  return (
    <div style={{
      background: '#1C1C1C',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      padding: '8px clamp(1rem,4vw,3rem)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Live dot */}
        <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px', flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', opacity: 0.75, animation: 'ping 1.5s ease-in-out infinite' }} />
          <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'block' }} />
        </span>

        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.55)' }}>
          Live Gold Rate
        </span>

        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 500, color: '#C9A84C', letterSpacing: '0.04em' }}>
          {rate ? `${formatPrice(rate)} / g` : '—'}
        </span>

        {updatedAt && (
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: 'rgba(250,250,247,0.25)', letterSpacing: '0.06em' }}>
            · {timeAgo(updatedAt)}
          </span>
        )}
      </div>
      <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.6);opacity:0} }`}</style>
    </div>
  )
}
