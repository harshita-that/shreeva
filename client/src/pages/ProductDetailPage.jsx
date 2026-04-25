import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios.js'

const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGQUY3Ii8+PC9zdmc+'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [goldRate, setGoldRate] = useState(null)
  const [showModel, setShowModel] = useState(false)
  const [pricePulse, setPricePulse] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchProduct = () => {
      api.get(`/products/${id}`).then(res => {
        const prevPrice = product?.final_price
        setProduct(res.data)
        setLastUpdated(res.data.gold_price_last_updated)
        if (prevPrice && prevPrice !== res.data.final_price) {
          setPricePulse(true)
          setTimeout(() => setPricePulse(false), 1200)
        }
      }).catch(console.error)
    }
    const fetchGold = () => {
      api.get('/gold-price').then(res => setGoldRate(res.data.price_per_gram)).catch(console.error)
    }
    fetchProduct()
    fetchGold()
    const productInterval = setInterval(fetchProduct, 15000)
    const goldInterval = setInterval(fetchGold, 10000)
    return () => {
      clearInterval(productInterval)
      clearInterval(goldInterval)
    }
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="py-20 text-center font-body text-dark/60">Loading...</div>
        <Footer />
      </div>
    )
  }

  const breakdown = product.price_breakdown || {
    goldPrice: goldRate || 0,
    weight: product.weight,
    makingCharges: product.making_charges,
    calculatedValue: Math.round((goldRate || 0) * product.weight)
  }
  const estimated = product.estimated_range

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        <Link to="/products" className="font-body text-sm text-gold hover:underline">← Back to Products</Link>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mt-6 md:mt-8">
          <div>
            {/* Main Image with hover swap */}
            <div
              className="relative aspect-[4/5] overflow-hidden border border-gold group"
              onMouseEnter={() => product.hover_image_url && setShowModel(true)}
              onMouseLeave={() => setShowModel(false)}
            >
              <img
                src={product.image_url || FALLBACK}
                alt={product.name}
                className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${showModel ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }}
              />
              {product.hover_image_url && (
                <img
                  src={product.hover_image_url}
                  alt={`${product.name} — model view`}
                  className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${showModel ? 'opacity-100' : 'opacity-0'}`}
                  onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0'; e.target.style.pointerEvents = 'none' }}
                />
              )}
            </div>

            {/* Thumbnail toggles */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModel(false)}
                className={`w-16 h-16 border overflow-hidden transition-all duration-300 ${!showModel ? 'border-gold ring-1 ring-gold' : 'border-gold/30 hover:border-gold'}`}
              >
                <img src={product.image_url || FALLBACK} alt="Product" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }} />
              </button>
              {product.hover_image_url && (
                <button
                  onClick={() => setShowModel(true)}
                  className={`w-16 h-16 border overflow-hidden transition-all duration-300 ${showModel ? 'border-gold ring-1 ring-gold' : 'border-gold/30 hover:border-gold'}`}
                >
                  <img src={product.hover_image_url} alt="Model" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }} />
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-gold">{product.category}</p>
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-dark mt-2">{product.name}</h1>
            <p className="font-body text-dark/70 mt-3 md:mt-4 leading-relaxed text-sm sm:text-base">{product.description || 'A beautifully crafted piece from our exclusive collection.'}</p>

            <div className="mt-6 md:mt-8 border border-gold p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-body uppercase tracking-wider border border-green-200">Auto-calculated</span>
                {lastUpdated && (
                  <span className="font-body text-[10px] text-dark/40">
                    Gold rate updated {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <div className="space-y-2 md:space-y-3 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/60">Gold Price</span>
                  <span>{formatPrice(breakdown.goldPrice)} <span className="text-dark/40">/ gram</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Weight</span>
                  <span>{breakdown.weight}g</span>
                </div>
                <div className="flex justify-between text-dark/80 font-medium">
                  <span>Gold Value</span>
                  <span>{formatPrice(breakdown.calculatedValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Making Charges</span>
                  <span>{formatPrice(breakdown.makingCharges)}</span>
                </div>

                {estimated && (
                  <div className="flex justify-between text-dark/50 text-xs pt-1">
                    <span>Estimated Range</span>
                    <span>{formatPrice(estimated.min)} – {formatPrice(estimated.max)}</span>
                  </div>
                )}

                <div className="border-t border-gold pt-3 flex justify-between font-semibold text-dark">
                  <span>Final Price</span>
                  <span className={`text-gold text-base sm:text-lg transition-colors duration-500 ${pricePulse ? 'text-green-600' : ''}`}>
                    {formatPrice(product.final_price)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-block mt-4 md:mt-6 px-6 sm:px-8 py-3 bg-dark text-cream font-body uppercase tracking-widest text-xs sm:text-sm hover:bg-gold transition-colors"
            >
              Send Enquiry
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
