import { useEffect, useState } from 'react'
import api from '../api/axios.js'

export default function GoldRateTicker() {
  const [rate, setRate] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    const fetchRate = () => {
      api.get('/gold-price').then(res => {
        setRate(res.data.price_per_gram)
        setUpdatedAt(res.data.updated_at)
      }).catch(console.error)
    }
    fetchRate()
    const interval = setInterval(fetchRate, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
  }

  const timeAgo = (dateString) => {
    if (!dateString) return ''
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="bg-dark text-cream py-3 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="font-body text-xs sm:text-sm uppercase tracking-widest text-center">
            Live Gold Rate: <span className="text-gold font-medium">{rate ? `${formatPrice(rate)} / gram` : 'Loading...'}</span>
          </span>
        </div>
        {updatedAt && (
          <span className="font-body text-[10px] sm:text-xs text-cream/40">
            Updated {timeAgo(updatedAt)}
          </span>
        )}
      </div>
    </div>
  )
}
