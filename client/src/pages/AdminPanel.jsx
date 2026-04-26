import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AdminOverview   from '../components/admin/AdminOverview'
import AdminProducts   from '../components/admin/AdminProducts'
import AdminPricing    from '../components/admin/AdminPricing'
import AdminEnquiries  from '../components/admin/AdminEnquiries'
import AdminMedia      from '../components/admin/AdminMedia'
import AdminSettings   from '../components/admin/AdminSettings'

const NAV = [
  { id: 'overview',   icon: '◈', label: 'Overview' },
  { id: 'products',   icon: '◇', label: 'Products' },
  { id: 'pricing',    icon: '◆', label: 'Pricing' },
  { id: 'enquiries',  icon: '◉', label: 'Enquiries' },
  { id: 'media',      icon: '▣', label: 'Media' },
  { id: 'settings',   icon: '◎', label: 'Settings' },
]

const VIEWS = {
  overview:  AdminOverview,
  products:  AdminProducts,
  pricing:   AdminPricing,
  enquiries: AdminEnquiries,
  media:     AdminMedia,
  settings:  AdminSettings,
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [view, setView]         = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const admin = JSON.parse(localStorage.getItem('shreeva_admin_user') || '{}')

  useEffect(() => {
    if (!localStorage.getItem('shreeva_admin_token')) navigate('/admin/login')
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('shreeva_admin_token')
    localStorage.removeItem('shreeva_admin_user')
    navigate('/admin/login')
  }

  const ActiveView = VIEWS[view]

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F5F0E8', fontFamily:"'Jost',sans-serif" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .adm-sidebar{width:${collapsed?'68px':'220px'};min-height:100vh;background:#1C1C1C;display:flex;flex-direction:column;transition:width 0.3s ease;flex-shrink:0;position:sticky;top:0;height:100vh;overflow:hidden}
        .adm-nav-btn{display:flex;align-items:center;gap:14px;padding:12px 20px;cursor:pointer;border:none;background:none;width:100%;text-align:left;color:rgba(255,255,255,0.5);font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.2s;white-space:nowrap}
        .adm-nav-btn:hover{color:#C9A84C;background:rgba(201,168,76,0.08)}
        .adm-nav-btn.active{color:#C9A84C;background:rgba(201,168,76,0.12);border-right:2px solid #C9A84C}
        .adm-nav-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;color:#C9A84C}
        .adm-main{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:auto}
        .adm-header{background:#fff;border-bottom:1px solid rgba(201,168,76,0.2);padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
        .adm-content{padding:28px;flex:1}
        .card{background:#fff;border-radius:10px;box-shadow:0 2px 12px rgba(28,28,28,0.06);border:1px solid rgba(201,168,76,0.15)}
        .metric-card{background:#fff;border-radius:10px;padding:22px 24px;box-shadow:0 2px 12px rgba(28,28,28,0.06);border:1px solid rgba(201,168,76,0.12);transition:box-shadow 0.2s,transform 0.2s}
        .metric-card:hover{box-shadow:0 6px 24px rgba(28,28,28,0.1);transform:translateY(-2px)}
        .btn-gold{background:#C9A84C;color:#1C1C1C;border:none;padding:9px 20px;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:background 0.2s}
        .btn-gold:hover{background:#b8963e}
        .btn-dark{background:#1C1C1C;color:#FAFAF7;border:none;padding:9px 20px;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:background 0.2s}
        .btn-dark:hover{background:#333}
        .btn-outline{background:transparent;color:#1C1C1C;border:1px solid rgba(201,168,76,0.5);padding:8px 18px;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all 0.2s}
        .btn-outline:hover{border-color:#C9A84C;background:rgba(201,168,76,0.06)}
        .skeleton{background:linear-gradient(90deg,#f0ede6 25%,#e8e4dc 50%,#f0ede6 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500}
        .tag-new{background:#fef9ec;color:#b8880e;border:1px solid #f5d87a}
        .tag-contacted{background:#f0faf5;color:#1a7a4a;border:1px solid #86d4ae}
        .tag-closed{background:#f5f5f5;color:#888;border:1px solid #ddd}
        table{width:100%;border-collapse:collapse}
        th{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(28,28,28,0.45);padding:10px 16px;text-align:left;border-bottom:1px solid rgba(201,168,76,0.15);font-weight:500}
        td{padding:12px 16px;border-bottom:1px solid rgba(201,168,76,0.08);font-size:13px;color:#1C1C1C;vertical-align:middle}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:rgba(201,168,76,0.03)}
        input,select,textarea{font-family:'Jost',sans-serif;font-size:13px;color:#1C1C1C;outline:none}
        .form-field label{display:block;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A84C;margin-bottom:6px}
        .form-field input,.form-field select,.form-field textarea{width:100%;border:1px solid rgba(201,168,76,0.4);border-radius:4px;padding:9px 12px;background:transparent;transition:border 0.2s}
        .form-field input:focus,.form-field select:focus,.form-field textarea:focus{border-color:#1C1C1C}
        .overlay{position:fixed;inset:0;background:rgba(28,28,28,0.5);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}
        .modal{background:#fff;border-radius:12px;padding:32px;width:90%;max-width:520px;max-height:90vh;overflow-y:auto;animation:scaleIn 0.25s ease;box-shadow:0 24px 64px rgba(28,28,28,0.18)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        .section-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1C1C1C;margin-bottom:4px}
        .section-sub{font-size:11px;color:rgba(28,28,28,0.45);letter-spacing:0.06em}
        @media(max-width:640px){.adm-sidebar{display:none}.adm-content{padding:16px}}
      `}</style>

      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div style={{padding:'20px 16px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:28,height:28,background:'#C9A84C',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:12,color:'#1C1C1C',fontWeight:700}}>S</span>
            </div>
            {!collapsed && <div>
              <div style={{color:'#FAFAF7',fontSize:12,fontWeight:600,letterSpacing:'0.05em'}}>Shreeva</div>
              <div style={{color:'rgba(255,255,255,0.3)',fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase'}}>Admin Console</div>
            </div>}
            <button onClick={() => setCollapsed(c => !c)} style={{marginLeft:'auto',background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:14,flexShrink:0}}>
              {collapsed ? '›' : '‹'}
            </button>
          </div>
        </div>

        <nav style={{flex:1,padding:'12px 0'}}>
          {NAV.map(n => (
            <button key={n.id} className={`adm-nav-btn${view===n.id?' active':''}`} onClick={() => setView(n.id)}>
              <span className="adm-nav-icon">{n.icon}</span>
              {!collapsed && n.label}
            </button>
          ))}
        </nav>

        <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <button onClick={handleLogout} className="adm-nav-btn" style={{color:'rgba(255,255,255,0.3)',padding:'10px 20px'}}>
            <span className="adm-nav-icon" style={{color:'rgba(255,255,255,0.3)'}}>⏻</span>
            {!collapsed && 'Logout'}
          </button>
          <Link
            to="/"
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'8px 20px', textDecoration:'none',
              color:'rgba(255,255,255,0.2)', fontFamily:"'Jost',sans-serif",
              fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase',
              transition:'color 0.2s', whiteSpace:'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,168,76,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
          >
            <span style={{fontSize:12, flexShrink:0}}>↗</span>
            {!collapsed && 'View Site'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <header className="adm-header">
          <div>
            <nav aria-label="Admin breadcrumb" style={{display:'flex',alignItems:'center',gap:6}}>
              <Link
                to="/"
                style={{fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(28,28,28,0.3)',textDecoration:'none',transition:'color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(28,28,28,0.3)'}
              >Site</Link>
              <span style={{color:'rgba(201,168,76,0.4)',fontSize:10}}>/</span>
              <span style={{fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(28,28,28,0.35)',cursor:'default'}}>Admin</span>
              <span style={{color:'rgba(201,168,76,0.4)',fontSize:10}}>/</span>
              <span style={{fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C9A84C'}}>
                {NAV.find(n => n.id === view)?.label}
              </span>
            </nav>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#22c55e'}} />
            <span style={{fontSize:11,color:'rgba(28,28,28,0.45)',letterSpacing:'0.08em'}}>LIVE</span>
            <div style={{width:1,height:16,background:'rgba(201,168,76,0.2)',margin:'0 4px'}} />
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:'#1C1C1C',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:'#C9A84C',fontSize:12,fontWeight:600}}>{(admin.username||'A')[0].toUpperCase()}</span>
              </div>
              <span style={{fontSize:12,color:'#1C1C1C',fontWeight:500}}>{admin.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        <div className="adm-content">
          <ActiveView onNavigate={setView} />
        </div>
      </main>
    </div>
  )
}
