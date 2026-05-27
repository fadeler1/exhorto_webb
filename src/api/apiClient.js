import { buildApiUrl } from './config.js'
import { extractApiMessage, messageForHttpStatus, readJsonSafe } from './httpUtils.js'

/**
 * @typedef {{
 *   ok: true
 *   status: number
 *   data: unknown
 * }} ApiOk
 * @typedef {{
 *   ok: false
 *   status: number
 *   message: string
 *   data?: unknown
 * }} ApiErr
 * @typedef {ApiOk | ApiErr} ApiResult
 */

/**
 * No desenvuelve `{ data, total }` paginado; sí `{ data: entity }` de un solo recurso.
 * @param {unknown} payload
 */
function resolveSuccessBody(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return payload
  }
  const o = /** @type {Record<string, unknown>} */ (payload)
  if ('data' in o && 'total' in o) {
    return payload
  }
  if ('data' in o) {
    return o.data
  }
  return payload
}

/**
 * Cliente HTTP con Bearer JWT (Postman collection: auth type bearer {{token}}).
 * @param {{
 *   getToken: () => string | null
 *   fetchImpl?: typeof fetch
 * }} deps
 */
export function createApiClient({ getToken, fetchImpl = fetch }) {
  /**
   * @param {string} path Ruta bajo /api, ej. `/exhortos` o `/auth/me`
   * @param {RequestInit} [options]
   * @returns {Promise<ApiResult>}
   */
  async function request(path, options = {}) {
    const url = buildApiUrl(path)
    const token = getToken()
    const headers = new Headers(options.headers ?? {})

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json')
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const body = options.body
    if (
      body != null &&
      typeof body === 'object' &&
      !(body instanceof FormData) &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json')
    }

    let res
    try {
      res = await fetchImpl(url, {
        ...options,
        headers,
        credentials: options.credentials ?? 'include',
        body:
          body != null &&
          typeof body === 'object' &&
          !(body instanceof FormData) &&
          !(typeof body === 'string')
            ? JSON.stringify(body)
            : body,
      })
    } catch {
      return {
        ok: false,
        status: 0,
        message: 'Error de red. Verifica tu conexión y que el backend esté en marcha.',
      }
    }

    const payload = await readJsonSafe(res)

    if (!res.ok) {
      const nested =
        payload && typeof payload === 'object' && 'data' in payload
          ? /** @type {{ data?: unknown }} */ (payload).data
          : payload
      const msg =
        extractApiMessage(payload) ||
        extractApiMessage(nested) ||
        messageForHttpStatus(res.status)
      return {
        ok: false,
        status: res.status,
        message: msg,
        data: nested ?? payload,
      }
    }

    const responseData = resolveSuccessBody(payload)

    return {
      ok: true,
      status: res.status,
      data: responseData,
    }
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) =>
      request(path, { ...options, method: 'POST', body }),
    patch: (path, body, options) =>
      request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  }
}
