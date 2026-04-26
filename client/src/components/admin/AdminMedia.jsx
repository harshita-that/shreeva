import { useState, useRef } from 'react'
import api from '../../api/axios'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('shreeva_admin_token')}` } })
const resolveImg = url => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${url}`
}

export default function AdminMedia() {
  const [uploaded, setUploaded] = useState([])
  const [uploading, setUploading] = useState(false)
  const [err, setErr]           = useState('')
  const [status, setStatus]     = useState('')
  const inputRef                = useRef()

  const notify = (msg, isErr=false) => {
    isErr ? setErr(msg) : setStatus(msg)
    setTimeout(() => { setStatus(''); setErr('') }, 3500)
  }

  const handleFiles = async files => {
    setUploading(true); setErr('')
    const results = []
    for (const file of Array.from(files)) {
      if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) { notify(`${file.name} is not a valid image`, true); continue }
      if (file.size > 5*1024*1024) { notify(`${file.name} exceeds 5MB limit`, true); continue }
      const fd = new FormData(); fd.append('image', file)
      try {
        const token = localStorage.getItem('shreeva_admin_token')
        const r = await api.post('/upload', fd, { headers: { Authorization: `Bearer ${token}` } })
        results.push({ url: r.data.url, name: file.name, size: file.size, id: Date.now()+Math.random() })
      } catch(ex) { notify(ex.response?.data?.error || `Failed to upload ${file.name}`, true) }
    }
    if (results.length > 0) { setUploaded(u => [...results, ...u]); notify(`${results.length} image(s) uploaded`) }
    setUploading(false)
  }

  const handleDrop = e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }
  const [dragOver, setDragOver] = useState(false)

  const copyUrl = url => {
    const full = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${url}`
    navigator.clipboard.writeText(full).then(() => notify('URL copied to clipboard'))
  }

  const remove = id => setUploaded(u => u.filter(f => f.id !== id))

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 className="section-title">Media Manager</h1>
        <p className="section-sub">Upload and manage product images</p>
      </div>

      {status && <div style={{ marginBottom:16, padding:'10px 14px', background:'#f0faf5', border:'1px solid #86d4ae', borderRadius:6, fontSize:13, color:'#1a7a4a' }}>{status}</div>}
      {err && <div style={{ marginBottom:16, padding:'10px 14px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, fontSize:13, color:'#dc2626' }}>{err}</div>}

      {/* Drop Zone */}
      <div
        className="card"
        style={{ marginBottom:24, padding:48, textAlign:'center', border:`2px dashed ${dragOver ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`, background: dragOver ? 'rgba(201,168,76,0.04)' : '#fff', cursor:'pointer', transition:'all 0.2s' }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        <div style={{ fontSize:36, marginBottom:12, opacity:0.4 }}>▣</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:'#1C1C1C', marginBottom:8 }}>
          {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
        </div>
        <div style={{ fontSize:12, color:'rgba(28,28,28,0.4)' }}>Supports JPG, PNG, WEBP · Max 5MB each</div>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} style={{ display:'none' }} />
      </div>

      {/* Uploaded Grid */}
      {uploaded.length > 0 && (
        <div>
          <div style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(28,28,28,0.4)', marginBottom:16 }}>Uploaded This Session ({uploaded.length})</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
            {uploaded.map(f => (
              <div key={f.id} className="card" style={{ overflow:'hidden' }}>
                <div style={{ aspectRatio:'4/3', background:'#F0EDE6', overflow:'hidden' }}>
                  <img src={resolveImg(f.url)} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display='none' }} />
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:11, color:'#1C1C1C', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:6 }}>{f.name}</div>
                  <div style={{ fontSize:10, color:'rgba(28,28,28,0.4)', marginBottom:10 }}>{(f.size/1024).toFixed(0)} KB</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => copyUrl(f.url)} style={{ flex:1, background:'rgba(201,168,76,0.1)', border:'none', borderRadius:3, padding:'5px 0', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#C9A84C', cursor:'pointer' }}>Copy URL</button>
                    <button onClick={() => remove(f.id)} style={{ background:'rgba(220,38,38,0.08)', border:'none', borderRadius:3, padding:'5px 8px', fontSize:10, color:'#dc2626', cursor:'pointer' }}>×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage tips */}
      <div className="card" style={{ padding:20, marginTop:24 }}>
        <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(28,28,28,0.35)', marginBottom:12 }}>How to Use</div>
        <div style={{ display:'grid', gap:8 }}>
          {[
            '1. Upload images here and copy their URL',
            '2. Go to Products → Add/Edit product → paste the URL as Primary or Hover image',
            '3. Images are stored on the server in /uploads/ and served publicly',
            '4. Supported formats: JPG, PNG, WEBP (max 5MB)',
          ].map((tip, i) => (
            <div key={i} style={{ fontSize:12, color:'rgba(28,28,28,0.5)', display:'flex', gap:8, alignItems:'flex-start' }}>
              <span style={{ color:'#C9A84C', flexShrink:0 }}>◆</span> {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
