/**
 * URL base de la API (Postman: baseUrl = http://localhost:3000/api).
 * En dev con proxy Vite puedes dejar VITE_API_BASE_URL vacío y usar rutas /api/...
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL ?? ''
  if (typeof raw !== 'string') return ''
  return raw.replace(/\/$/, '')
}

/**
 * @param {string} path
 * @returns {string}
 */
export function buildApiUrl(path) {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!base) return normalized
  return `${base}${normalized}`
}
