/**
 * @param {unknown} value
 * @returns {string}
 */
export function extractApiMessage(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : extractApiMessage(item)))
      .filter(Boolean)
      .join('. ')
  }
  if (typeof value !== 'object') return ''
  const o = /** @type {Record<string, unknown>} */ (value)
  const direct =
    o.message ?? o.error ?? o.detail ?? o.mensaje ?? o.msg ?? o.descripcion
  if (typeof direct === 'string') return direct
  if (Array.isArray(direct)) return extractApiMessage(direct)
  if (
    typeof o.errors === 'object' &&
    o.errors != null &&
    'message' in /** @type {object} */ (o.errors)
  ) {
    const m = /** @type {{ message?: unknown }} */ (o.errors).message
    return extractApiMessage(m)
  }
  return ''
}

/**
 * @param {Response} res
 */
export async function readJsonSafe(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

/**
 * @param {number} status
 * @param {string} [fallback]
 */
export function messageForHttpStatus(status, fallback) {
  if (status === 401 || status === 403) {
    return 'Usuario o contraseña incorrectos.'
  }
  if (status >= 500) {
    return 'El servidor no está disponible. Intenta más tarde.'
  }
  return fallback ?? 'No se pudo completar la solicitud.'
}
