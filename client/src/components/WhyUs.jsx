import { useEffect, useRef, useState } from 'react'

const pillars = [
  {
    label: 'BIS Hallmarked',
    desc: 'Certified purity on every piece',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="#C9A84C" strokeWidth="1" width="36" height="36">
        <circle cx="20" cy="20" r="13" />
        <path d="M14 20l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Handcrafted',
    desc: 'Shaped by master artisans',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="#C9A84C" strokeWidth="1" width="36" height="36">
        <path d="M20 32c-5-3-9-8-9-13a9 9 0 0118 0c0 5-4 10-9 13z" />
        <path d="M20 25l-3-4 3-5 3 5-3 4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Live Gold Pricing',
    desc: 'Transparent real-time rates',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="#C9A84C" strokeWidth="1" width="36" height="36">
        <path d="M8 32V22" strokeLinecap="round" />
        <path d="M16 32V16" strokeLinecap="round" />
        <path d="M24 32V12" strokeLinecap="round" />
        <path d="M32 32V8"  strokeLinecap="round" />
        <circle cx="32" cy="8" r="2" fill="#C9A84C" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Lifetime Support',
    desc: 'We stand behind every piece',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="#C9A84C" strokeWidth="1" width="36" height="36">
        <path d="M20 34c5-3 10-8 10-14V12l-10-5-10 5v8c0 6 5 11 10 14z" />
        <path d="M15 20l4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function WhyUs() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fallback = setTimeout(() => setInView(true), 400)
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); clearTimeout(fallback) } },
      { threshold: 0 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [])

  return (
    <section style={{ padding: 'clamp(3rem,5.5vw,5rem) 1.5rem', background: '#1C1C1C' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div
          ref={ref}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(2.5rem,5vw,4rem)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>
            Our Standards
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 500, color: '#FAFAF7', letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: '14px' }}>
            The Shreeva Promise
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#C9A84C', margin: '0 auto', opacity: 0.7, borderRadius: '1px' }} />
        </div>

        {/* Pillars */}
        <style>{`
          .wu-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem 2rem;
          }
          @media (min-width: 768px) {
            .wu-grid { grid-template-columns: repeat(4, 1fr); gap: 1rem; }
          }
        `}</style>

        <div className="wu-grid">
          {pillars.map((p, i) => (
            <div
              key={p.label}
              style={{
                textAlign: 'center',
                padding: '0 0.5rem',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.85s ease ${0.15 + i * 0.12}s, transform 0.85s ease ${0.15 + i * 0.12}s`,
              }}
            >
              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.1rem' }}>
                {p.icon}
              </div>

              {/* Thin divider */}
              <div style={{ width: '28px', height: '1px', background: '#C9A84C', margin: '0 auto 1rem', opacity: 0.5 }} />

              {/* Label */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#FAFAF7',
                  letterSpacing: '0.02em',
                  marginBottom: '8px',
                }}
              >
                {p.label}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '0.78rem',
                  color: 'rgba(250,250,247,0.45)',
                  letterSpacing: '0.03em',
                  lineHeight: 1.65,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
