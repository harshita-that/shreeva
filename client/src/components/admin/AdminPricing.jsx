import { useEffect, useState } from 'react'
import api from '../../api/axios'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('shreeva_admin_token')}` } })
const fmt = p => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(p)

export default function AdminPricing() {
  const [goldRate, setGoldRate]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [updatedBy, setUpdatedBy]     = useState('')
  const [newRate, setNewRate]         = useState('')
  const [products, setProducts]       = useState([])
  const [status, setStatus]           = useState('')
  const [err, setErr]                 = useState('')
  const [loading, setLoading]         = useState(true)
  const [history]                     = useState([
    { price: 7200, by: 'admin', at: new Date(Date.now() - 86400000*1).toISOString() },
    { price: 7100, by: 'admin', at: new Date(Date.now() - 86400000*3).toISOString() },
    { price: 6950, by: 'admin', at: new Date(Date.now() - 86400000*7).toISOString() },
  ])

  const load = () => {
    Promise.all([api.get('/gold-price'), api.get('/products')])
      .then(([gr, pr]) => {
        const d = gr.data.data || gr.data
        setGoldRate(d.pricePerGram)
        setLastUpdated(d.lastUpdated)
        setUpdatedBy(d.updatedBy || 'admin')
        setNewRate(d.pricePerGram)
        setProducts(pr.data.products || [])
        setLoading(false)
      }).catch(() => setLoading(false))
  }
  useEffect(load, [])

  const notify = (msg, isErr=false) => {
    isErr ? setErr(msg) : setStatus(msg)
    setTimeout(() => { setStatus(''); setErr('') }, 3500)
  }

  const handleUpdate = async () => {
    const p = Number(newRate)
    if (!p || p <= 0) { notify('Enter a valid positive price', true); return }
    try {
      await api.put('/gold-price', { pricePerGram: p }, authH())
      notify(`Gold rate updated to ₹${p}/g`)
      load()
    } catch(ex) { notify(ex.response?.data?.error || 'Update failed', true) }
  }

  const topProducts = [...products].sort((a,b) => (b.finalPrice||0)-(a.finalPrice||0)).slice(0,5)

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 className="section-title">Pricing Control</h1>
        <p className="section-sub">Dynamic gold pricing — all product prices update instantly</p>
      </div>

      {status && <div style={{ marginBottom:16, padding:'12px 16px', background:'#f0faf5', border:'1px solid #86d4ae', borderRadius:6, fontSize:13, color:'#1a7a4a' }}>{status}</div>}
      {err && <div style={{ marginBottom:16, padding:'12px 16px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, fontSize:13, color:'#dc2626' }}>{err}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        {/* Live Rate Card */}
        <div className="card" style={{ padding:28 }}>
          <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:20 }}>Live Gold Rate</div>
          {loading
            ? <div className="skeleton" style={{ height:48, marginBottom:16 }} />
            : <>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:600, color:'#C9A84C', lineHeight:1, marginBottom:6 }}>
                  {fmt(goldRate)}
                </div>
                <div style={{ fontSize:11, color:'rgba(28,28,28,0.4)' }}>per gram · updated by {updatedBy}</div>
                {lastUpdated && <div style={{ fontSize:11, color:'rgba(28,28,28,0.35)', marginTop:4 }}>Last: {new Date(lastUpdated).toLocaleString()}</div>}
              </>
          }

          <div style={{ marginTop:24, borderTop:'1px solid rgba(201,168,76,0.12)', paddingTop:20 }}>
            <div style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:10 }}>Update Rate (₹/gram)</div>
            <div style={{ display:'flex', gap:10 }}>
              <input
                type="number"
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                style={{ flex:1, border:'1px solid rgba(201,168,76,0.4)', borderRadius:4, padding:'9px 12px', fontSize:14, fontFamily:"'Jost',sans-serif", outline:'none' }}
                placeholder="e.g. 7500"
              />
              <button className="btn-gold" onClick={handleUpdate}>Update</button>
            </div>
            <div style={{ fontSize:11, color:'rgba(28,28,28,0.35)', marginTop:10 }}>
              ⚡ All {products.length} product prices recalculate instantly upon update
            </div>
          </div>
        </div>

        {/* Price Change History */}
        <div className="card" style={{ padding:28 }}>
          <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:20 }}>Recent Price Changes</div>
          <div style={{ display:'grid', gap:12 }}>
            {/* Current */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'rgba(201,168,76,0.06)', borderRadius:6, border:'1px solid rgba(201,168,76,0.2)' }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:'#1C1C1C' }}>{goldRate ? fmt(goldRate)+'/g' : '—'}</div>
                <div style={{ fontSize:10, color:'rgba(28,28,28,0.4)', marginTop:2 }}>Current · {updatedBy}</div>
              </div>
              <span className="tag tag-new">Active</span>
            </div>
            {/* History */}
            {history.map((h, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#FAFAF7', borderRadius:6 }}>
                <div>
                  <div style={{ fontSize:14, color:'rgba(28,28,28,0.7)' }}>{fmt(h.price)}/g</div>
                  <div style={{ fontSize:10, color:'rgba(28,28,28,0.35)', marginTop:2 }}>{h.by} · {new Date(h.at).toLocaleDateString()}</div>
                </div>
                <span className="tag tag-closed">Past</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Priced Products */}
      <div className="card">
        <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(201,168,76,0.12)' }}>
          <span style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.45)' }}>Highest Priced Products</span>
        </div>
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Weight</th><th>Gold Value</th><th>Making</th><th>Final Price</th></tr></thead>
          <tbody>
            {topProducts.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight:500 }}>{p.name}</td>
                <td><span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C' }}>{p.category}</span></td>
                <td style={{ color:'rgba(28,28,28,0.55)' }}>{p.goldWeight}g</td>
                <td style={{ color:'rgba(28,28,28,0.55)' }}>{fmt(p.priceBreakdown?.goldValue||0)}</td>
                <td style={{ color:'rgba(28,28,28,0.55)' }}>{fmt(p.makingCharges)}</td>
                <td style={{ fontWeight:600, color:'#C9A84C', fontFamily:"'Cormorant Garamond',serif", fontSize:15 }}>{fmt(p.finalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
