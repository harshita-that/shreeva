import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('shreeva_admin_token')}` } })
const fmt = p => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(p)

const CATEGORY_COLORS = { rings:'#C9A84C', necklaces:'#b8963e', earrings:'#d4b76a', bracelets:'#8a6f30', bangles:'#e8c97e', pendants:'#9e7b36', chains:'#c4a24a', other:'#666' }

export default function AdminOverview({ onNavigate }) {
  const [products, setProducts]   = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [goldRate, setGoldRate]   = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/enquiry', authH()),
      api.get('/gold-price'),
    ]).then(([pr, er, gr]) => {
      setProducts(pr.data.products || [])
      setEnquiries(er.data.data || [])
      setGoldRate(gr.data.data?.pricePerGram)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const totalRevenue = products.reduce((s, p) => s + (p.finalPrice || 0), 0)
  const newEnquiries = enquiries.filter(e => e.status === 'new' || !e.status).length

  const catData = Object.entries(
    products.reduce((acc, p) => { acc[p.category] = (acc[p.category]||0)+1; return acc }, {})
  ).map(([name, value]) => ({ name, value }))

  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const enquiryBar = months.map((m, i) => ({ name: m, enquiries: Math.floor(Math.random()*8+1) }))

  const Skeleton = ({ h=18, w='100%' }) => (
    <div className="skeleton" style={{ height:h, width:w, borderRadius:4 }} />
  )

  const metrics = [
    { label:'Total Products', value: loading ? null : products.length, sub:'In inventory', icon:'◇', color:'#C9A84C', nav:'products' },
    { label:'Total Enquiries', value: loading ? null : enquiries.length, sub:`${newEnquiries} new`, icon:'◉', color:'#7c6fbf', nav:'enquiries' },
    { label:'Live Gold Rate', value: loading ? null : `₹${goldRate}/g`, sub:'Per gram today', icon:'◆', color:'#e8a838' },
    { label:'Portfolio Value', value: loading ? null : fmt(totalRevenue), sub:'Combined listing value', icon:'◈', color:'#3baa72' },
  ]

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 className="section-title">Dashboard Overview</h1>
        <p className="section-sub">Shreeva Jewellers — Live Control Center</p>
      </div>

      {/* Metric Cards */}
      <style>{`
        .ov-metrics { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
        .ov-charts  { display:grid; grid-template-columns:1fr; gap:16px; margin-bottom:24px; }
        .metric-card { background:#fff; border-radius:8px; border:1px solid rgba(201,168,76,0.15); padding:18px 20px; }
        @media(min-width:640px) {
          .ov-metrics { grid-template-columns:repeat(2,1fr); gap:16px; }
        }
        @media(min-width:900px) {
          .ov-metrics { grid-template-columns:repeat(4,1fr); }
          .ov-charts  { grid-template-columns:1fr 1fr; gap:20px; }
        }
      `}</style>
      <div className="ov-metrics">
        {metrics.map(m => (
          <div key={m.label} className="metric-card" onClick={() => m.nav && onNavigate(m.nav)} style={{ cursor: m.nav ? 'pointer' : 'default' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <span style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)' }}>{m.label}</span>
              <span style={{ fontSize:18, color:m.color }}>{m.icon}</span>
            </div>
            {loading
              ? <><Skeleton h={28} w="70%" /><Skeleton h={10} w="50%" style={{ marginTop:8 }} /></>
              : <>
                  <div style={{ fontSize:26, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'#1C1C1C', lineHeight:1.1 }}>{m.value}</div>
                  <div style={{ fontSize:11, color:'rgba(28,28,28,0.4)', marginTop:6 }}>{m.sub}</div>
                </>
            }
          </div>
        ))}
      </div>

      {/* Charts — stacks to 1 col on mobile */}
      <div className="ov-charts">
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:16 }}>Product Categories</div>
          {loading ? <div className="skeleton" style={{ height:180 }} /> : (
            catData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {catData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#C9A84C'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontFamily:"'Jost',sans-serif", fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(28,28,28,0.3)', fontSize:12 }}>No data</div>
          )}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', marginTop:8 }}>
            {catData.map(c => (
              <span key={c.name} style={{ fontSize:11, color:'rgba(28,28,28,0.5)', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background: CATEGORY_COLORS[c.name]||'#C9A84C', display:'inline-block' }} />
                {c.name} ({c.value})
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:16 }}>Enquiry Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={enquiryBar} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'rgba(28,28,28,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'rgba(28,28,28,0.4)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:"'Jost',sans-serif", fontSize:12 }} />
              <Bar dataKey="enquiries" fill="#C9A84C" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="card">
        <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(201,168,76,0.12)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.45)' }}>Recent Enquiries</span>
          <button className="btn-outline" onClick={() => onNavigate('enquiries')}>View All</button>
        </div>
        {loading
          ? <div style={{ padding:24 }}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:36, marginBottom:10 }} />)}</div>
          : enquiries.length === 0
            ? <div style={{ padding:32, textAlign:'center', color:'rgba(28,28,28,0.3)', fontSize:12 }}>No enquiries yet</div>
            : <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Message</th><th>Status</th></tr></thead>
                <tbody>
                  {enquiries.slice(0, 5).map(e => (
                    <tr key={e._id}>
                      <td style={{ fontWeight:500 }}>{e.name}</td>
                      <td style={{ color:'rgba(28,28,28,0.55)' }}>{e.phone}</td>
                      <td style={{ color:'rgba(28,28,28,0.55)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.message || '—'}</td>
                      <td><span className={`tag tag-${e.status||'new'}`}>{e.status||'new'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
        }
      </div>
    </div>
  )
}
