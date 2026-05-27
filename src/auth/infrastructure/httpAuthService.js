import { buildApiUrl } from '../../api/config.js'
import {
  extractApiMessage,
  messageForHttpStatus,
  readJsonSafe,
} from '../../api/httpUtils.js'

/**
 * @typedef {{ username: string, password: string }} LoginCredentials
 * @typedef {{ success: true, token: string, user?: Record<string, unknown> }} LoginOk
 * @typedef {{ success: false, message: string }} LoginErr
 * @typedef {LoginOk | LoginErr} LoginResult
 */

/**
 * @typedef {{ login: (c: LoginCredentials) => Promise<LoginResult> }} AuthService
 */

/**
 * NestJS exhorto-backend: POST /api/auth/login
 * Body: { "username": "...", "password": "..." } (también acepta `usuario`).
 * Respuesta: { "token": "...", "user": { username, nombre, perfil, mustChangePassword } }
 *
 * @param {{
 *   loginPath?: string
 *   usernameField?: string
 *   passwordField?: string
 *   fetchImpl?: typeof fetch
 * }} [options]
 * @returns {AuthService}
 */
export function createHttpAuthService(options = {}) {
  const loginPath =
    options.loginPath ?? import.meta.env.VITE_AUTH_LOGIN_PATH ?? '/auth/login'
  const usernameField =
    options.usernameField ??
    import.meta.env.VITE_AUTH_USERNAME_FIELD ??
    'username'
  const passwordField =
    options.passwordField ??
    import.meta.env.VITE_AUTH_PASSWORD_FIELD ??
    'password'
  const fetchImpl = options.fetchImpl ?? fetch

  return {
    /**
     * @param {LoginCredentials} credentials
     * @returns {Promise<LoginResult>}
     */
    async login(credentials) {
      const url = buildApiUrl(loginPath)
      let res
      try {
        res = await fetchImpl(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            [usernameField]: credentials.username,
            [passwordField]: credentials.password,
          }),
        })
      } catch {
        return { success: false, message: 'Error de red. Verifica tu conexión.' }
      }

      const payload = await readJsonSafe(res)
      const nested =
        payload && typeof payload === 'object' && 'data' in payload
          ? /** @type {{ data?: unknown }} */ (payload).data
          : payload

      if (!res.ok) {
        const msg =
          extractApiMessage(payload) ||
          extractApiMessage(nested) ||
          messageForHttpStatus(res.status, 'No se pudo iniciar sesión.')
        return { success: false, message: msg }
      }

      const data = nested && typeof nested === 'object' ? nested : payload
      const d = /** @type {Record<string, unknown>} */ (
        data && typeof data === 'object' ? data : {}
      )
      const tokenCandidate =
        d.token ?? d.access_token ?? (d.accessToken && String(d.accessToken))
      const token = typeof tokenCandidate === 'string' ? tokenCandidate : ''

      if (!token) {
        return {
          success: false,
          message:
            'El servidor respondió sin token. Revisa VITE_API_BASE_URL y VITE_AUTH_LOGIN_PATH.',
        }
      }

      const userUnknown = d.user
      const user =
        userUnknown && typeof userUnknown === 'object'
          ? /** @type {Record<string, unknown>} */ (userUnknown)
          : {}

      return { success: true, token, user }
    },
  }
}
