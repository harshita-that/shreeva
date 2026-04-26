import { useState } from 'react'

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants']

export default function FilterBar({ onFilterChange }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('default')

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    // DB stores category in lowercase — pass lowercase for filtering
    onFilterChange({ category: cat === 'All' ? '' : cat.toLowerCase(), sort })
  }

  const handleSort = (e) => {
    const val = e.target.value
    setSort(val)
    onFilterChange({ category: activeCategory === 'All' ? '' : activeCategory, sort: val })
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-b border-gold">
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 font-body text-xs uppercase tracking-widest border transition-colors ${
              activeCategory === cat
                ? 'bg-dark text-cream border-dark'
                : 'bg-transparent text-dark border-gold hover:bg-dark hover:text-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={handleSort}
        className="font-body text-sm border border-gold bg-cream px-4 py-1.5 outline-none"
      >
        <option value="default">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  )
}
