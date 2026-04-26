/**
 * Breadcrumb — Luxury minimal breadcrumb navigation.
 * Accepts a `crumbs` array: [{ label, to }]
 * Last item is current page (not a link).
 */
import { Link } from 'react-router-dom'

export default function Breadcrumb({ crumbs = [] }) {
  if (!crumbs.length) return null

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {!isLast ? (
                <>
                  <Link
                    to={crumb.to}
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(28,28,28,0.4)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,28,28,0.4)')}
                  >
                    {crumb.label}
                  </Link>
                  {/* Gold separator */}
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '10px',
                      color: 'rgba(201,168,76,0.5)',
                      userSelect: 'none',
                    }}
                  >
                    /
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                  }}
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
