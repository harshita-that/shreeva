import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios.js'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/enquiry', form)
      setStatus('Enquiry sent successfully!')
      setForm({ name: '', phone: '', message: '' })
    } catch {
      setStatus('Failed to send enquiry.')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-0 min-h-[500px] md:min-h-[600px]">
          {/* Dark Info Panel */}
          <div className="bg-dark text-cream p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-3 md:mb-4">Get In Touch</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">Contact Us</h1>
            <p className="font-body text-cream/70 mb-6 md:mb-8 leading-relaxed text-sm sm:text-base">
              Have a question about our collection or want to place a custom order? Reach out to us and our team will be delighted to assist you.
            </p>
            <div className="space-y-3 md:space-y-4 font-body text-sm">
              <div>
                <p className="text-gold uppercase tracking-widest text-xs mb-1">Address</p>
                <p className="text-cream/80">123 Gold Street, Mumbai, Maharashtra 400001, India</p>
              </div>
              <div>
                <p className="text-gold uppercase tracking-widest text-xs mb-1">Phone</p>
                <p className="text-cream/80">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-gold uppercase tracking-widest text-xs mb-1">Email</p>
                <p className="text-cream/80">hello@aurajewels.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cream border border-gold border-t-0 md:border-t md:border-l-0 border-l-0 md:border-l p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-dark mb-2">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gold bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-dark"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-dark mb-2">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gold bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-dark"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-dark mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gold bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-dark resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-dark text-cream font-body uppercase tracking-widest text-xs sm:text-sm hover:bg-gold transition-colors"
              >
                Send Enquiry
              </button>
              {status && <p className="font-body text-sm text-center mt-2 text-green-700">{status}</p>}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
