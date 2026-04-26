import { useEffect, useState } from 'react'
import api from '../../api/axios'
import ImageUpload from '../ImageUpload'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('shreeva_admin_token')}` } })
const fmt = p => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(p)
const resolveImg = url => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${url}`
}

const EMPTY = { name:'', goldWeight:'', makingCharges:'', category:'', description:'', image_primary:'', image_hover:'' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState({...EMPTY})
  const [status, setStatus]     = useState('')
  const [err, setErr]           = useState('')
  const [search, setSearch]     = useState('')
  const [filterCat, setFilterCat] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/products').then(r => { setProducts(r.data.products||[]); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(load, [])

  const notify = (msg, isErr=false) => {
    isErr ? setErr(msg) : setStatus(msg)
    setTimeout(() => { setStatus(''); setErr('') }, 3500)
  }

  const openModal = (p=null) => {
    setErr('')
    if (p) {
      setEditing(p)
      setForm({ name:p.name, goldWeight:p.goldWeight, makingCharges:p.makingCharges, category:p.category, description:p.description||'', image_primary:p.images?.[0]||'', image_hover:p.images?.[1]||'' })
    } else {
      setEditing(null); setForm({...EMPTY})
    }
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditing(null); setForm({...EMPTY}); setErr('') }

  const handleSubmit = async e => {
    e.preventDefault(); setErr('')
    if (!form.image_primary.trim()) { setErr('Primary image is required'); return }
    const images = form.image_hover.trim() ? [form.image_primary.trim(), form.image_hover.trim()] : [form.image_primary.trim()]
    const payload = { name:form.name, goldWeight:Number(form.goldWeight), makingCharges:Number(form.makingCharges), category:form.category.toLowerCase(), description:form.description, images }
    try {
      if (editing) { await api.put(`/products/${editing._id}`, payload, authH()); notify('Product updated') }
      else { await api.post('/products', payload, authH()); notify('Product created') }
      closeModal(); load()
    } catch(ex) { setErr(ex.response?.data?.error||'Error saving product') }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this product permanently?')) return
    try { await api.delete(`/products/${id}?permanent=true`, authH()); notify('Deleted'); load() }
    catch { notify('Delete failed', true) }
  }

  const cats = [...new Set(products.map(p => p.category))]
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || p.category === filterCat
    return matchSearch && matchCat
  })

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
        <div>
          <h1 className="section-title">Products</h1>
          <p className="section-sub">{products.length} items in inventory</p>
        </div>
        <button className="btn-dark" onClick={() => openModal()}>+ Add Product</button>
      </div>

      {status && <div style={{ marginBottom:16, padding:'12px 16px', background:'#f0faf5', border:'1px solid #86d4ae', borderRadius:6, fontSize:13, color:'#1a7a4a' }}>{status}</div>}
      {err && !modal && <div style={{ marginBottom:16, padding:'12px 16px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, fontSize:13, color:'#dc2626' }}>{err}</div>}

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex:1, border:'1px solid rgba(201,168,76,0.3)', borderRadius:4, padding:'8px 12px', fontSize:13, background:'#fff', outline:'none' }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ border:'1px solid rgba(201,168,76,0.3)', borderRadius:4, padding:'8px 12px', fontSize:13, background:'#fff', color:'#1C1C1C', outline:'none' }}>
          <option value="">All Categories</option>
          {cats.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {loading
          ? <div style={{ padding:24 }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:52, marginBottom:8 }} />)}</div>
          : <div style={{ overflowX:'auto' }}>
              <table style={{ minWidth:700 }}>
                <thead>
                  <tr><th>Image</th><th>Name</th><th>Category</th><th>Weight</th><th>Making</th><th>Final Price</th><th style={{ textAlign:'right' }}>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ width:42, height:42, borderRadius:6, overflow:'hidden', background:'#F0EDE6' }}>
                          <img src={resolveImg(p.images?.[0])} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display='none' }} />
                        </div>
                      </td>
                      <td style={{ fontWeight:500, color:'#1C1C1C' }}>{p.name}</td>
                      <td><span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C', background:'rgba(201,168,76,0.1)', padding:'3px 8px', borderRadius:20 }}>{p.category}</span></td>
                      <td style={{ color:'rgba(28,28,28,0.6)' }}>{p.goldWeight}g</td>
                      <td style={{ color:'rgba(28,28,28,0.6)' }}>{fmt(p.makingCharges)}</td>
                      <td style={{ fontWeight:600, color:'#C9A84C', fontFamily:"'Cormorant Garamond',serif", fontSize:15 }}>{fmt(p.finalPrice)}</td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                          <button onClick={() => openModal(p)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C' }}>Edit</button>
                          <button onClick={() => handleDelete(p._id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#dc2626' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'rgba(28,28,28,0.3)', fontSize:13 }}>No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        }
      </div>

      {/* Modal */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600 }}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closeModal} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:'rgba(28,28,28,0.3)', lineHeight:1 }}>×</button>
            </div>
            {err && <div style={{ marginBottom:16, padding:'10px 14px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, fontSize:13, color:'#dc2626' }}>{err}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gap:16 }}>
                <div className="form-field"><label>Product Name</label><input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Royal Gold Ring" required /></div>
                <div className="form-field"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} required style={{ width:'100%', border:'1px solid rgba(201,168,76,0.4)', borderRadius:4, padding:'9px 12px', background:'transparent' }}>
                    <option value="">Select...</option>
                    {['rings','necklaces','earrings','bracelets','bangles','pendants','chains','other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="form-field"><label>Gold Weight (g)</label><input type="number" step="0.01" min="0.01" value={form.goldWeight} onChange={e => setForm({...form, goldWeight:e.target.value})} required /></div>
                  <div className="form-field"><label>Making Charges (₹)</label><input type="number" min="0" value={form.makingCharges} onChange={e => setForm({...form, makingCharges:e.target.value})} required /></div>
                </div>
                <ImageUpload label="Primary Image" value={form.image_primary} onChange={url => setForm({...form, image_primary:url})} onError={setErr} />
                <ImageUpload label="Hover Image (optional)" value={form.image_hover} onChange={url => setForm({...form, image_hover:url})} onError={setErr} />
                <div className="form-field"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} rows={3} placeholder="Describe the product..." style={{ resize:'none' }} /></div>
                <div style={{ display:'flex', gap:10, paddingTop:4 }}>
                  <button type="submit" className="btn-dark" style={{ flex:1 }}>{editing ? 'Update' : 'Create Product'}</button>
                  <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
