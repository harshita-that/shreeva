import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-body text-dark/60">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 py-8">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
