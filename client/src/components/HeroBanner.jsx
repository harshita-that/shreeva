export default function HeroBanner() {
  return (
    <section className="relative bg-cream border-b border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-20 lg:py-24 flex flex-col items-center text-center">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-gold mb-4 font-body">Timeless Elegance</p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-dark mb-4 md:mb-6 leading-tight">
          Crafted in Gold<br />Designed for You
        </h1>
        <p className="font-body text-dark/70 max-w-xl mb-6 md:mb-8 text-base sm:text-lg px-2 sm:px-0">
          Discover our exquisite collection of handcrafted gold jewellery, where tradition meets modern luxury.
        </p>
        <a href="/products" className="inline-block px-6 sm:px-8 py-3 bg-dark text-cream font-body uppercase tracking-widest text-xs sm:text-sm hover:bg-gold transition-colors">
          Explore Collection
        </a>
      </div>
    </section>
  )
}
