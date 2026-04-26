/**
 * BackButton — Reusable minimal back navigation.
 * Uses browser history if available, falls back to `fallback` prop (default: '/').
 */
import { useNavigate } from 'react-router-dom'

export default function BackButton({ fallback = '/', label = 'Back', style = {} }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      onClick={handleBack}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Jost', sans-serif",
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(28,28,28,0.5)',
        padding: '6px 0',
        transition: 'color 0.2s ease',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,28,28,0.5)')}
    >
      {/* Arrow */}
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0 }}>
        <path d="M13 5H1M1 5L5 1M1 5L5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  )
}
