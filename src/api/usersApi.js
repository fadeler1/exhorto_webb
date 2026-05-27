import { USER_PERFIL } from '../auth/userPerfil.js'

/**
 * @typedef {{
 *   id: string
 *   nombre: string
 *   login: string
 *   email: string
 *   perfil: string
 *   autorizacion?: number
 *   mustChangePassword?: boolean
 *   createdAt?: string
 *   updatedAt?: string
 * }} UserListItem
 */

/**
 * @typedef {{
 *   nombre: string
 *   login: string
 *   email: string
 *   perfil: string
 *   password?: string
 * }} UserFormPayload
 */

/**
 * @param {import('./apiClient.js').ApiResult} result
 * @returns {UserListItem[]}
 */
export function parseUsersListResponse(result) {
  if (!result.ok) return []
  const payload = result.data
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
    return payload.data
  }
  return []
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 */
export function fetchUsers(apiClient) {
  return apiClient.get('/users')
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {UserFormPayload} payload
 */
export function createUser(apiClient, payload) {
  return apiClient.post('/users', payload)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} id
 * @param {Partial<UserFormPayload>} payload
 */
export function updateUser(apiClient, id, payload) {
  return apiClient.patch(`/users/${id}`, payload)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} id
 */
export function deleteUser(apiClient, id) {
  return apiClient.delete(`/users/${id}`)
}

/**
 * @param {string} perfil
 */
export function getPerfilLabel(perfil) {
  if (perfil === USER_PERFIL.TODO) return 'ADMIN'
  if (perfil === USER_PERFIL.INGRESAR) return 'INGRESADOR'
  return perfil || '—'
}

/**
 * @param {string} perfil
 */
export function isPerfilAdmin(perfil) {
  return perfil === USER_PERFIL.TODO
}
