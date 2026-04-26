import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', color: 'rgba(28,28,28,0.4)', letterSpacing: '0.08em' }}>
          No products found.
        </p>
      </div>
    )
  }

  return (
    /* Global .product-grid from index.css: 1 → 2 → 3 col with consistent gap */
    <div className="product-grid" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
