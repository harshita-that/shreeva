import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import api from '../api/axios.js'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchFeatured = () => {
      api.get('/products').then(res => setProducts(res.data.slice(0, 4))).catch(console.error)
    }
    fetchFeatured()
    const interval = setInterval(fetchFeatured, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-gold">
      <p className="text-xs sm:text-sm uppercase tracking-widest text-gold mb-2 font-body text-center">Curated For You</p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dark text-center mb-8 md:mb-12">Featured Pieces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  )
}
