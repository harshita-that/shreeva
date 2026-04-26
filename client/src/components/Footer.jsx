import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#1C1C1C',
      borderTop: '1px solid rgba(201,168,76,0.2)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(2.5rem,5vw,4rem) clamp(1rem,4vw,3rem)',
      }}>
        {/* Grid */}
        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          @media (min-width: 640px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; } }
          @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr; gap: 3rem; } }
          .footer-link {
            font-family: 'Jost', sans-serif;
            font-size: 13px;
            color: rgba(250,250,247,0.5);
            text-decoration: none;
            letter-spacing: 0.04em;
            transition: color 0.25s ease;
            display: block;
            padding: 3px 0;
          }
          .footer-link:hover { color: #C9A84C; }
        `}</style>

        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src="/logo.png"
                alt="Shreeva Jewellers"
                style={{ height: '28px', width: 'auto' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: '#FAFAF7', letterSpacing: '0.04em' }}>
                Shreeva Jewellers
              </span>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', lineHeight: 1.75, color: 'rgba(250,250,247,0.45)', maxWidth: '280px', letterSpacing: '0.02em' }}>
              Timeless gold jewellery crafted with passion and precision since 1995.
            </p>
            {/* Gold divider */}
            <div style={{ width: '36px', height: '1px', background: '#C9A84C', opacity: 0.5, marginTop: '20px' }} />
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Link to="/"         className="footer-link">Home</Link>
              <Link to="/products" className="footer-link">Collection</Link>
              <Link to="/contact"  className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Reach Us
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                '123 Gold Street, Mumbai',
                '+91 98765 43210',
                'hello@shreevajewellers.com',
              ].map((line) => (
                <p key={line} style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', color: 'rgba(250,250,247,0.45)', letterSpacing: '0.02em' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 'clamp(2rem,4vw,3rem)',
          paddingTop: '20px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: 'rgba(250,250,247,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} Shreeva Jewellers
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: 'rgba(250,250,247,0.18)', letterSpacing: '0.08em' }}>
            BIS Hallmarked · 22K Gold
          </p>
        </div>
      </div>
    </footer>
  )
}
