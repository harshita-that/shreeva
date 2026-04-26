import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import api from '../api/axios.js'

const INPUT_STYLE = {
  width: '100%',
  padding: '11px 14px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '13px',
  letterSpacing: '0.03em',
  color: '#1C1C1C',
  background: 'transparent',
  border: '1px solid rgba(201,168,76,0.35)',
  borderRadius: '3px',
  outline: 'none',
  transition: 'border-color 0.25s ease',
  boxSizing: 'border-box',
}

const LABEL_STYLE = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(28,28,28,0.5)',
  marginBottom: '7px',
}

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  /* ── EXISTING API LOGIC — UNTOUCHED ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.post('/enquiry', form)
      setStatus('success')
      setForm({ name: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem)' }}>
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

        {/* Two-column grid */}
        <style>{`
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr;
            min-height: 480px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 32px rgba(28,28,28,0.08);
          }
          @media (min-width: 768px) { .contact-grid { grid-template-columns: 1fr 1fr; } }
          .contact-input:focus { border-color: #C9A84C !important; }
        `}</style>

        <div className="contact-grid" style={{ marginTop: '1.5rem' }}>

          {/* Left — Info panel */}
          <div style={{ background: '#1C1C1C', padding: 'clamp(2rem,5vw,3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
              Get In Touch
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 400, color: '#FAFAF7', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: '14px' }}>
              We'd Love<br />to Hear From You
            </h1>
            <div style={{ width: '36px', height: '2px', background: '#C9A84C', opacity: 0.7, borderRadius: '1px', marginBottom: '1.5rem' }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', lineHeight: 1.8, color: 'rgba(250,250,247,0.5)', maxWidth: '340px', marginBottom: '2rem' }}>
              Have a question or want a custom piece? Our team typically responds within the same day.
            </p>

            {[
              { label: 'Address', value: '123 Gold Street, Mumbai, India' },
              { label: 'Phone',   value: '+91 98765 43210' },
              { label: 'Email',   value: 'hello@shreevajewellers.com' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '16px' }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '4px' }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', color: 'rgba(250,250,247,0.6)', letterSpacing: '0.02em' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div style={{ background: '#FAFAF7', padding: 'clamp(2rem,5vw,3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid rgba(201,168,76,0.12)' }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              Send Enquiry
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={LABEL_STYLE}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" style={INPUT_STYLE} className="contact-input" />
              </div>
              <div>
                <label style={LABEL_STYLE}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" style={INPUT_STYLE} className="contact-input" />
              </div>
              <div>
                <label style={LABEL_STYLE}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we help?"
                  style={{ ...INPUT_STYLE, resize: 'none', lineHeight: 1.7 }}
                  className="contact-input"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="smooth-btn"
                style={{
                  padding: '13px',
                  background: sending ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #C9A84C, #b8963e)',
                  color: '#1C1C1C',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 3px 16px rgba(201,168,76,0.2)',
                }}
              >
                {sending ? 'Sending…' : 'Send Enquiry'}
              </button>

              {status === 'success' && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: '#16a34a', textAlign: 'center', letterSpacing: '0.06em' }}>
                  ✓ Enquiry sent — we'll be in touch shortly.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: '#dc2626', textAlign: 'center', letterSpacing: '0.06em' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
