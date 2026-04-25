import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GoldRateTicker from '../components/GoldRateTicker'
import FilterBar from '../components/FilterBar'
import ProductGrid from '../components/ProductGrid'
import api from '../api/axios.js'

export default function ProductListingPage() {
  const [allProducts, setAllProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCriteria, setFilterCriteria] = useState({ category: '', sort: 'default' })

  const applyFilters = (products, { category, sort }) => {
    let result = [...products]
    if (category) {
      result = result.filter(p => p.category === category)
    }
    if (sort === 'price-low') {
      result.sort((a, b) => a.final_price - b.final_price)
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.final_price - a.final_price)
    }
    return result
  }

  useEffect(() => {
    const fetchProducts = () => {
      api.get('/products')
        .then(res => {
          setAllProducts(res.data)
          setFiltered(prev => applyFilters(res.data, filterCriteria))
          setLoading(false)
        })
        .catch(console.error)
    }
    fetchProducts()
    const interval = setInterval(fetchProducts, 15000)
    return () => clearInterval(interval)
  }, [filterCriteria])

  const handleFilter = ({ category, sort }) => {
    setFilterCriteria({ category, sort })
    setFiltered(applyFilters(allProducts, { category, sort }))
  }

  return (
    <div>
      <Navbar />
      <GoldRateTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-gold mb-2 font-body">Collection</p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4 md:mb-6">All Jewellery</h1>
        <FilterBar onFilterChange={handleFilter} />
        {loading ? (
          <div className="py-20 text-center font-body text-dark/60">Loading...</div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
      <Footer />
    </div>
  )
}
