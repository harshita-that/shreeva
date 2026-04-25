const features = [
  {
    title: 'Certified Purity',
    desc: 'BIS Hallmark certified gold, guaranteed authenticity.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <circle cx="16" cy="16" r="10" />
        <path d="M16 11v5l3 1.5" />
        <path d="M10 7l2.5-3h7l2.5 3" />
      </svg>
    )
  },
  {
    title: 'Handcrafted',
    desc: 'Every piece is shaped by skilled artisans with decades of mastery.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M16 26c-4-2-7-6-7-10a7 7 0 0114 0c0 4-3 8-7 10z" />
        <path d="M16 20l-3-3 3-5 3 5-3 3z" />
      </svg>
    )
  },
  {
    title: 'Live Pricing',
    desc: 'Real-time gold rate integration for transparent, fair valuation.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M6 26V18" />
        <path d="M13 26V14" />
        <path d="M20 26V10" />
        <path d="M27 26V6" />
        <circle cx="27" cy="6" r="1.5" />
      </svg>
    )
  },
  {
    title: 'Secure Shipping',
    desc: 'Insured, tracked delivery with tamper-proof packaging.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M16 28c4-2 8-6 8-12V10l-8-4-8 4v6c0 6 4 10 8 12z" />
        <path d="M12 16l3 3 5-5" />
      </svg>
    )
  },
]

export default function WhyUs() {
  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-gold">
      <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gold mb-3 font-body text-center">Our Standards</p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dark text-center mb-12 md:mb-16">Our Promise</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {features.map((f) => (
          <div key={f.title} className="group text-center transition-transform duration-300 hover:scale-105">
            <div className="text-gold flex items-center justify-center mb-6">
              {f.icon}
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-dark mb-3">{f.title}</h3>
            <p className="font-body text-sm text-dark/60 leading-relaxed max-w-[16rem] mx-auto">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
