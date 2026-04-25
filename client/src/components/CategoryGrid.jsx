const categories = [
  { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop' },
  { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&h=400&fit=crop' },
  { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9abac038?w=400&h=400&fit=crop' },
  { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220e?w=400&h=400&fit=crop' },
  { name: 'Pendants', image: 'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=400&h=400&fit=crop' },
]

export default function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <p className="text-xs sm:text-sm uppercase tracking-widest text-gold mb-2 font-body text-center">Shop By</p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dark text-center mb-8 md:mb-12">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <a href={`/products?category=${cat.name}`} key={cat.name} className="group">
            <div className="aspect-square overflow-hidden border border-gold">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGQUY3Ii8+PC9zdmc+' }}
              />
            </div>
            <p className="mt-3 md:mt-4 text-center font-body text-xs sm:text-sm uppercase tracking-widest text-dark">{cat.name}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
