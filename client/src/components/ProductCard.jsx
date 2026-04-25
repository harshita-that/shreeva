import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGQUY3Ii8+PC9zdmc+'

export default function ProductCard({ product }) {
  const [pulse, setPulse] = useState(false)
  const [prevPrice, setPrevPrice] = useState(product?.final_price)

  useEffect(() => {
    if (prevPrice && prevPrice !== product?.final_price) {
      setPulse(true)
      setTimeout(() => setPulse(false), 1200)
    }
    setPrevPrice(product?.final_price)
  }, [product?.final_price])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
  }

  const hasHover = product.hover_image_url && product.hover_image_url.trim() !== ''

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden border border-gold bg-[#FAFAF7]">
        {/* Default product image — always visible underneath */}
        <img
          src={product.image_url || FALLBACK}
          alt={product.name}
          className="absolute inset-0 z-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }}
        />
        {/* Hover model image — fades in ON TOP so default remains underneath as safety net */}
        {hasHover && (
          <img
            src={product.hover_image_url}
            alt={`${product.name} — model view`}
            className="absolute inset-0 z-10 w-full h-full object-cover transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0'; e.target.style.pointerEvents = 'none' }}
          />
        )}
      </div>
      <div className="mt-3 md:mt-4 text-center">
        <p className="font-body text-xs uppercase tracking-widest text-gold">{product.category}</p>
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-dark mt-1">{product.name}</h3>
        <p className={`font-body text-sm sm:text-base mt-1 md:mt-2 transition-colors duration-500 ${pulse ? 'text-green-600' : 'text-dark'}`}>
          {formatPrice(product.final_price)}
        </p>
      </div>
    </Link>
  )
}
