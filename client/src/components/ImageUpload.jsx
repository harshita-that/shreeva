import { useState, useRef, useCallback } from 'react'
import api from '../api/axios.js'

const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGQUY3Ii8+PC9zdmc+'

export default function ImageUpload({ label, value, onChange, onError }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await api.post('/upload', formData)
      onChange(res.data.url)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Upload failed. Please try again.'
      console.error('Upload failed', err.response?.data || err)
      if (onError) onError(msg)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="w-full">
      <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{label}</p>

      {value ? (
        <div className="relative border border-gold overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.src = FALLBACK }}
          />
          <div className="absolute inset-0 bg-dark/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-1.5 bg-cream text-dark font-body text-xs uppercase tracking-widest hover:bg-gold transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-1.5 border border-cream text-cream font-body text-xs uppercase tracking-widest hover:bg-cream hover:text-dark transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed cursor-pointer transition-all duration-300
            flex flex-col items-center justify-center gap-2 py-10 px-4
            ${dragActive
              ? 'border-gold bg-[#FAFAF7]'
              : 'border-gold/40 hover:border-gold hover:bg-[#FAFAF7]'
            }
          `}
        >
          <span className="text-gold text-2xl leading-none">+</span>
          <p className="font-body text-sm text-dark/60 text-center">
            {uploading ? 'Uploading...' : 'Drag & drop image or click to upload'}
          </p>
          <p className="font-body text-xs text-dark/40">JPG, PNG, WEBP up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
