import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ImageUpload from '../components/ImageUpload'
import api from '../api/axios.js'

const EMPTY_FORM = { name: '', weight: '', making_charges: '', image_url: '', hover_image_url: '', category: '', description: '' }

export default function AdminPanel() {
  const navigate = useNavigate()
  const [goldRate, setGoldRate] = useState(0)
  const [goldRateUpdated, setGoldRateUpdated] = useState(null)
  const [newRate, setNewRate] = useState('')
  const [products, setProducts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('aura_admin_auth') !== 'true') {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_auth')
    navigate('/admin/login')
  }

  const fetchGoldRate = () => {
    api.get('/gold-price').then(res => {
      setGoldRate(res.data.price_per_gram)
      setNewRate(res.data.price_per_gram)
      setGoldRateUpdated(res.data.updated_at)
    }).catch(console.error)
  }

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error)
  }

  useEffect(() => {
    fetchGoldRate()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (status || error) {
      const t = setTimeout(() => { setStatus(''); setError('') }, 4000)
      return () => clearTimeout(t)
    }
  }, [status, error])

  const handleUpdateGoldRate = async () => {
    try {
      await api.put('/gold-price', { price_per_gram: Number(newRate) })
      setStatus('Gold rate updated successfully')
      fetchGoldRate()
      fetchProducts()
    } catch {
      setError('Failed to update gold rate')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const openModal = (product = null) => {
    setError('')
    if (product) {
      setEditingProduct(product)
      setForm({
        name: product.name,
        weight: product.weight,
        making_charges: product.making_charges,
        image_url: product.image_url || '',
        hover_image_url: product.hover_image_url || '',
        category: product.category,
        description: product.description || ''
      })
    } else {
      setEditingProduct(null)
      setForm({ ...EMPTY_FORM })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
    setForm({ ...EMPTY_FORM })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.image_url.trim()) {
      setError('Product image is required. Please upload a default image.')
      return
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form)
        setStatus('Product updated successfully')
      } else {
        await api.post('/products', form)
        setStatus('Product added successfully')
      }
      closeModal()
      fetchProducts()
    } catch {
      setError('Failed to save product. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setStatus('Product deleted')
      fetchProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark text-cream font-body uppercase tracking-widest text-xs hover:bg-gold transition-colors duration-300"
            >
              <span className="text-lg leading-none">+</span>
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-[#C9A84C] font-body uppercase tracking-widest text-xs hover:bg-dark hover:text-[#FAFAF7] transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 transition-all duration-300">
            <p className="font-body text-sm text-green-800">{status}</p>
          </div>
        )}
        {error && !modalOpen && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 transition-all duration-300">
            <p className="font-body text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Gold Rate Card */}
        <div className="border border-[#C9A84C] p-5 sm:p-6 mb-8 md:mb-10 bg-white">
          <p className="font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-4">Gold Price Management</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <p className="font-body text-sm text-dark/60">Current Rate</p>
              <p className="font-heading text-xl sm:text-2xl font-bold text-dark mt-0.5">{formatPrice(goldRate)} / gram</p>
              {goldRateUpdated && (
                <p className="font-body text-[11px] text-dark/40 mt-1">
                  Last updated {new Date(goldRateUpdated).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex-1 w-full sm:w-auto max-w-xs">
              <input
                type="number"
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                className="w-full border border-[#C9A84C] bg-transparent px-4 py-2 font-body text-sm outline-none focus:border-dark transition-colors"
              />
            </div>
            <button
              onClick={handleUpdateGoldRate}
              className="px-6 py-2.5 bg-dark text-[#FAFAF7] font-body uppercase tracking-widest text-xs hover:bg-[#C9A84C] hover:text-dark transition-colors duration-300 w-full sm:w-auto"
            >
              Update Rate
            </button>
          </div>
          <p className="font-body text-[11px] text-dark/50 mt-3">
            Changing the gold rate recalculates all product prices instantly — no database updates needed.
          </p>
        </div>

        {/* Product Table */}
        <div className="border border-[#C9A84C] overflow-hidden bg-white">
          <div className="px-4 sm:px-6 py-4 border-b border-[#C9A84C] flex items-center justify-between">
            <p className="font-body text-xs uppercase tracking-widest text-[#C9A84C]">Product Inventory</p>
            <span className="font-body text-xs text-dark/50">{products.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-[#C9A84C]">
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3 w-14">Image</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3">Name</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3">Category</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3">Weight</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3">Making</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3">Price</th>
                  <th className="font-body text-xs uppercase tracking-widest text-[#C9A84C] px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-[#C9A84C]/20 hover:bg-[#FAFAF7] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 border border-[#C9A84C]/40 overflow-hidden">
                        <img
                          src={p.image_url || ''}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0ZBRkFGNyIvPjwvc3ZnPg==' }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-dark whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 font-body text-sm text-dark">{p.category}</td>
                    <td className="px-4 py-3 font-body text-sm text-dark">{p.weight}g</td>
                    <td className="px-4 py-3 font-body text-sm text-dark">{formatPrice(p.making_charges)}</td>
                    <td className="px-4 py-3 font-body text-sm text-dark font-medium whitespace-nowrap">{formatPrice(p.final_price)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openModal(p)} className="font-body text-xs uppercase tracking-wider text-[#C9A84C] hover:underline transition-all">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="font-body text-xs uppercase tracking-wider text-red-600 hover:underline transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center font-body text-sm text-dark/50">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-dark/30 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full overflow-y-auto bg-[#FAFAF7] border-l border-[#C9A84C] shadow-none transition-transform duration-500 ease-out">
            <div className="p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl font-bold text-dark">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="font-body text-2xl text-dark/40 hover:text-dark transition-colors leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal Error */}
              {error && modalOpen && (
                <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3">
                  <p className="font-body text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Royal Gold Ring" required className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors" />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Rings, Necklaces" required className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Weight (g)</label>
                    <input name="weight" type="number" step="0.01" value={form.weight} onChange={handleChange} placeholder="0.00" required className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors" />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Making Charges (₹)</label>
                    <input name="making_charges" type="number" value={form.making_charges} onChange={handleChange} placeholder="0" required className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors" />
                  </div>
                </div>

                {/* Image Uploads */}
                <div>
                  <ImageUpload
                    label="Product Image"
                    value={form.image_url}
                    onChange={(url) => setForm({ ...form, image_url: url })}
                    onError={setError}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Hover Image (Model)"
                    value={form.hover_image_url}
                    onChange={(url) => setForm({ ...form, hover_image_url: url })}
                    onError={setError}
                  />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the product..." rows="3" className="w-full border border-[#C9A84C] bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-dark transition-colors resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-dark text-[#FAFAF7] font-body uppercase tracking-widest text-xs hover:bg-[#C9A84C] hover:text-dark transition-colors duration-300"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-[#C9A84C] font-body uppercase tracking-widest text-xs hover:bg-dark hover:text-[#FAFAF7] transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
