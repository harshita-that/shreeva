import { useNavigate } from 'react-router-dom'

export default function AdminSettings() {
  const navigate  = useNavigate()
  const admin     = JSON.parse(localStorage.getItem('shreeva_admin_user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('shreeva_admin_token')
    localStorage.removeItem('shreeva_admin_user')
    navigate('/admin/login')
  }

  const INFO = [
    { label:'API Base URL',      value: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' },
    { label:'Environment',       value: import.meta.env.MODE || 'development' },
    { label:'Image Storage',     value: '/uploads/ (server filesystem)' },
    { label:'Auth Method',       value: 'JWT Bearer Token (7 days)' },
    { label:'Pricing Model',     value: 'finalPrice = goldPrice × weight + makingCharges' },
    { label:'Gold Price',        value: 'Singleton document — auto-seeds ₹7200/g' },
  ]

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 className="section-title">Settings</h1>
        <p className="section-sub">Admin profile & system configuration</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Admin Profile */}
        <div className="card" style={{ padding:28 }}>
          <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:20 }}>Admin Profile</div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#1C1C1C', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#C9A84C', fontSize:22, fontWeight:700 }}>{(admin.username||'A')[0].toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'#1C1C1C' }}>{admin.username || 'Admin'}</div>
              <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C', marginTop:3 }}>{admin.role || 'admin'}</div>
            </div>
          </div>

          <div style={{ display:'grid', gap:12 }}>
            {[
              { label:'Username', value: admin.username || '—' },
              { label:'Role',     value: admin.role || 'admin' },
              { label:'Session',  value: localStorage.getItem('shreeva_admin_token') ? '✓ Active JWT' : '—' },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
                <span style={{ fontSize:12, color:'rgba(28,28,28,0.45)', letterSpacing:'0.06em' }}>{row.label}</span>
                <span style={{ fontSize:12, color:'#1C1C1C', fontWeight:500 }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button className="btn-outline" onClick={handleLogout} style={{ marginTop:24, width:'100%', color:'#dc2626', borderColor:'rgba(220,38,38,0.25)' }}>
            Sign Out
          </button>
        </div>

        {/* System Config */}
        <div>
          <div className="card" style={{ padding:28, marginBottom:16 }}>
            <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:20 }}>System Configuration</div>
            <div style={{ display:'grid', gap:10 }}>
              {INFO.map(row => (
                <div key={row.label} style={{ padding:'10px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
                  <div style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:4 }}>{row.label}</div>
                  <div style={{ fontSize:12, color:'#1C1C1C', fontFamily:"'Jost',monospace" }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:28 }}>
            <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:16 }}>API Endpoints</div>
            <div style={{ display:'grid', gap:8 }}>
              {[
                { method:'GET',    path:'/api/products',   access:'Public' },
                { method:'POST',   path:'/api/products',   access:'Admin' },
                { method:'GET',    path:'/api/gold-price', access:'Public' },
                { method:'PUT',    path:'/api/gold-price', access:'Admin' },
                { method:'POST',   path:'/api/upload',     access:'Admin' },
                { method:'POST',   path:'/api/enquiry',    access:'Public' },
                { method:'GET',    path:'/api/enquiry',    access:'Admin' },
              ].map((ep, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 10px', background:'#FAFAF7', borderRadius:4 }}>
                  <span style={{ fontSize:9, letterSpacing:'0.12em', fontWeight:700, color: ep.method==='GET' ? '#3baa72' : ep.method==='POST' ? '#7c6fbf' : '#e8a838', width:36 }}>{ep.method}</span>
                  <span style={{ fontSize:11, fontFamily:'monospace', color:'rgba(28,28,28,0.65)', flex:1 }}>{ep.path}</span>
                  <span style={{ fontSize:9, letterSpacing:'0.1em', color: ep.access==='Admin' ? '#C9A84C' : 'rgba(28,28,28,0.3)', textTransform:'uppercase' }}>{ep.access}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
