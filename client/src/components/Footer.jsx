import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-cream py-12 md:py-16 px-4 sm:px-6 lg:px-12 border-t border-gold">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4">Aura Jewels</h3>
          <p className="font-body text-sm text-cream/70">Timeless gold jewellery crafted with passion and precision since 1995.</p>
        </div>
        <div>
          <h4 className="font-body text-xs sm:text-sm uppercase tracking-widest text-gold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-body text-sm text-cream/70 hover:text-gold">Home</Link>
            <Link to="/products" className="font-body text-sm text-cream/70 hover:text-gold">Products</Link>
            <Link to="/contact" className="font-body text-sm text-cream/70 hover:text-gold">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs sm:text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
          <p className="font-body text-sm text-cream/70">123 Gold Street, Mumbai, India</p>
          <p className="font-body text-sm text-cream/70 mt-2">+91 98765 43210</p>
          <p className="font-body text-sm text-cream/70 mt-2">hello@aurajewels.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gold/30 text-center">
        <p className="font-body text-xs text-cream/50 uppercase tracking-widest">© 2024 Aura Jewels. All rights reserved.</p>
      </div>
    </footer>
  )
}
