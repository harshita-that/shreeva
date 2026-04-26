import { useEffect, useState } from 'react'
import api from '../../api/axios'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('shreeva_admin_token')}` } })

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [filter, setFilter]       = useState('all')
  const [toast, setToast]         = useState('')

  const load = () => {
    setLoading(true)
    api.get('/enquiry', authH())
      .then(r => { setEnquiries(r.data.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const cycleStatus = async (e, ev) => {
    ev.stopPropagation()
    const next = { new: 'contacted', contacted: 'closed', closed: 'new' }
    const nextStatus = next[e.status || 'new']
    try {
      await api.patch(`/enquiry/${e._id}/status`, { status: nextStatus }, authH())
      setEnquiries(es => es.map(x => x._id === e._id ? { ...x, status: nextStatus } : x))
      if (selected?._id === e._id) setSelected(s => ({ ...s, status: nextStatus }))
      notify(`Status → ${nextStatus}`)
    } catch { notify('Failed to update status') }
  }

  const handleDelete = async (id, ev) => {
    if (ev) ev.stopPropagation()
    if (!window.confirm('Delete this enquiry?')) return
    try {
      await api.delete(`/enquiry/${id}`, authH())
      setEnquiries(es => es.filter(e => e._id !== id))
      if (selected?._id === id) setSelected(null)
      notify('Enquiry deleted')
    } catch { notify('Delete failed') }
  }

  const getStatus = e => e.status || 'new'
  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => getStatus(e) === filter)
  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => getStatus(e) === 'new').length,
    contacted: enquiries.filter(e => getStatus(e) === 'contacted').length,
    closed: enquiries.filter(e => getStatus(e) === 'closed').length,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">Enquiries</h1>
        <p className="section-sub">{enquiries.length} total customer enquiries</p>
      </div>

      {toast && (
        <div style={{ marginBottom: 14, padding: '10px 16px', background: '#f0faf5', border: '1px solid #86d4ae', borderRadius: 6, fontSize: 13, color: '#1a7a4a' }}>{toast}</div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${filter === k ? '#C9A84C' : 'rgba(201,168,76,0.25)'}`, background: filter === k ? '#C9A84C' : 'transparent', color: filter === k ? '#1C1C1C' : 'rgba(28,28,28,0.55)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Jost',sans-serif" }}>
            {k} ({v})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading
            ? <div style={{ padding: 24 }}>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)}</div>
            : filtered.length === 0
              ? <div style={{ padding: 40, textAlign: 'center', color: 'rgba(28,28,28,0.3)', fontSize: 13 }}>No enquiries in this category</div>
              : <table>
                  <thead>
                    <tr><th>Name</th><th>Phone</th><th>Message</th><th>Product</th><th>Date</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(e => {
                      const st = getStatus(e)
                      return (
                        <tr key={e._id} onClick={() => setSelected(e)} style={{ cursor: 'pointer' }}>
                          <td style={{ fontWeight: 500 }}>{e.name}</td>
                          <td style={{ color: 'rgba(28,28,28,0.55)' }}>{e.phone}</td>
                          <td style={{ color: 'rgba(28,28,28,0.45)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message || '—'}</td>
                          <td style={{ color: 'rgba(28,28,28,0.45)', fontSize: 12 }}>{e.productId?.name || '—'}</td>
                          <td style={{ color: 'rgba(28,28,28,0.4)', fontSize: 12 }}>{e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                          <td onClick={ev => cycleStatus(e, ev)}>
                            <span className={`tag tag-${st}`} style={{ cursor: 'pointer' }} title="Click to cycle status">{st}</span>
                          </td>
                          <td style={{ textAlign: 'right' }} onClick={ev => ev.stopPropagation()}>
                            <button onClick={ev => handleDelete(e._id, ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dc2626' }}>Delete</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
          }
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(28,28,28,0.4)' }}>Enquiry Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'rgba(28,28,28,0.3)' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { label: 'Customer', value: selected.name, big: true },
                { label: 'Phone',    value: selected.phone },
                { label: 'Product',  value: selected.productId?.name || 'General enquiry' },
                { label: 'Received', value: selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-IN') : '—' },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: row.big ? 18 : 13, fontFamily: row.big ? "'Cormorant Garamond',serif" : 'inherit', fontWeight: row.big ? 600 : 400 }}>{row.value}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(28,28,28,0.4)', marginBottom: 4 }}>Message</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(28,28,28,0.65)', background: '#FAFAF7', padding: 12, borderRadius: 6 }}>{selected.message || 'No message provided'}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(28,28,28,0.4)', marginBottom: 8 }}>Status</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['new', 'contacted', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={async (ev) => {
                        ev.stopPropagation()
                        await api.patch(`/enquiry/${selected._id}/status`, { status: s }, authH())
                        setEnquiries(es => es.map(x => x._id === selected._id ? { ...x, status: s } : x))
                        setSelected(sel => ({ ...sel, status: s }))
                        notify(`Status → ${s}`)
                      }}
                      style={{ flex: 1, padding: '7px 4px', borderRadius: 4, border: `1px solid ${selected.status === s ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`, background: selected.status === s ? 'rgba(201,168,76,0.12)' : 'transparent', color: selected.status === s ? '#C9A84C' : 'rgba(28,28,28,0.4)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Jost',sans-serif" }}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,0.12)' }}>
                <a href={`tel:${selected.phone}`} className="btn-dark" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '9px 0', display: 'block', fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>📞 Call</a>
                <button className="btn-outline" onClick={() => handleDelete(selected._id)} style={{ flex: 1, color: '#dc2626', borderColor: 'rgba(220,38,38,0.25)' }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
