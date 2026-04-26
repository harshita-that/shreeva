import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GoldRateTicker from '../components/GoldRateTicker'
import FilterBar from '../components/FilterBar'
import ProductGrid from '../components/ProductGrid'
import Breadcrumb from '../components/Breadcrumb'
import api from '../api/axios.js'

export default function ProductListingPage() {
  const [allProducts, setAllProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCriteria, setFilterCriteria] = useState({ category: '', sort: 'default' })

  const applyFilters = (products, { category, sort }) => {
    let result = [...products]
    // DB stores category in lowercase — compare lowercase both sides
    if (category) {
      result = result.filter(p => p.category === category.toLowerCase())
    }
    if (sort === 'price-low') {
      result.sort((a, b) => a.finalPrice - b.finalPrice)
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.finalPrice - a.finalPrice)
    }
    return result
  }

  useEffect(() => {
    const fetchProducts = () => {
      api.get('/products')
        .then(res => {
          // API returns { success, count, products: [...] }
          const products = res.data.products || []
          setAllProducts(products)
          setFiltered(applyFilters(products, filterCriteria))
          setLoading(false)
        })
        .catch(() => setLoading(false))
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2.5rem,5vw,4rem) clamp(1rem,4vw,3rem)' }}>
        <Breadcrumb crumbs={[
          { label: 'Home',       to: '/' },
          { label: 'Collection' },
        ]} />
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Collection</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, color: '#1C1C1C', marginBottom: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '0.02em', lineHeight: 1.1 }}>All Jewellery</h1>
        <FilterBar onFilterChange={handleFilter} />
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', fontFamily: "'Jost',sans-serif", fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(28,28,28,0.35)', textTransform: 'uppercase' }}>Loading...</div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
      <Footer />
    </div>
  )
}
