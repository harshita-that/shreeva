/**
 * Resolves a product image URL for both local and production environments.
 *
 * Images uploaded via the local admin panel are stored as:
 *   http://localhost:5000/uploads/filename.jpg
 *
 * In production these must be rewritten to use the deployed backend URL.
 * We derive the backend root from VITE_API_URL by stripping "/api" suffix.
 */

const API_ROOT = (() => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  // Remove trailing /api so we get the server root for /uploads paths
  return base.replace(/\/api\/?$/, '')
})()

export function resolveImageUrl(url) {
  if (!url || url.trim() === '') return null

  // Already an absolute non-localhost URL (cloud storage, CDN, etc.) — use as-is
  if (url.startsWith('http') && !url.includes('localhost')) return url

  // data: URI — use as-is
  if (url.startsWith('data:')) return url

  // Localhost absolute URL — swap the host for the deployed backend root
  if (url.includes('localhost')) {
    // e.g. http://localhost:5000/uploads/img.jpg → https://backend.onrender.com/uploads/img.jpg
    return url.replace(/https?:\/\/localhost:\d+/, API_ROOT)
  }

  // Relative path like /uploads/img.jpg — prepend backend root
  if (url.startsWith('/')) return `${API_ROOT}${url}`

  return url
}
