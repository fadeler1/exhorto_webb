import { buildApiUrl } from '../../api/config.js'
import {
  extractApiMessage,
  messageForHttpStatus,
  readJsonSafe,
} from '../../api/httpUtils.js'

/**
 * @typedef {{ ok: true, data: Record<string, unknown> }} RecoveryOk
 * @typedef {{ ok: false, message: string, status?: number }} RecoveryErr
 * @typedef {RecoveryOk | RecoveryErr} RecoveryResult
 */

/**
 * @param {{
 *   fetchImpl?: typeof fetch
 *   forgotPath?: string
 *   validatePath?: string
 *   resetPath?: string
 * }} [options]
 */
export function createPasswordRecoveryApi(options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch
  const forgotPath =
    options.forgotPath ??
    import.meta.env.VITE_AUTH_FORGOT_PATH ??
    '/auth/forgot-password'
  const validatePath =
    options.validatePath ??
    import.meta.env.VITE_AUTH_VALIDATE_RECOVERY_PATH ??
    '/auth/validate-recovery-code'
  const resetPath =
    options.resetPath ??
    import.meta.env.VITE_AUTH_RESET_PASSWORD_PATH ??
    '/auth/reset-password'

  /**
   * @param {string} path
   * @param {Record<string, unknown>} body
   * @returns {Promise<RecoveryResult>}
   */
  async function postJson(path, body) {
    const url = buildApiUrl(path)
    let res
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    } catch {
      return { ok: false, message: 'Error de red. Verifica tu conexión.' }
    }

    const payload = await readJsonSafe(res)
    if (!res.ok) {
      const msg =
        extractApiMessage(payload) ||
        messageForHttpStatus(res.status, 'No se pudo completar la solicitud.')
      return { ok: false, message: msg, status: res.status }
    }

    return {
      ok: true,
      data:
        payload && typeof payload === 'object'
          ? /** @type {Record<string, unknown>} */ (payload)
          : {},
    }
  }

  return {
    /**
     * @param {string} email
     * @returns {Promise<RecoveryResult>}
     */
    forgotPassword(email) {
      return postJson(forgotPath, { email })
    },

    /**
     * @param {string} email
     * @param {number} codigo
     * @returns {Promise<RecoveryResult>}
     */
    validateRecoveryCode(email, codigo) {
      return postJson(validatePath, { email, codigo })
    },

    /**
     * @param {string} email
     * @param {number} codigo
     * @param {string} password
     * @returns {Promise<RecoveryResult>}
     */
    resetPassword(email, codigo, password) {
      return postJson(resetPath, { email, codigo, password })
    },
  }
}
