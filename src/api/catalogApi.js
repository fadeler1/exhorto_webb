/**
 * @typedef {{
 *   _id?: string
 *   codigo: string
 *   etiqueta: string
 *   etiquetaLegacy: string
 *   activo?: boolean
 *   orden?: number
 * }} DiligenciaTipo
 */

/**
 * GET /catalog/diligencias — colección diligencia_tipos en MongoDB.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 */
export async function fetchDiligenciaTipos(apiClient) {
  const result = await apiClient.get('/catalog/diligencias')
  if (!result.ok) {
    return { ok: false, message: result.message, items: [] }
  }
  const items = Array.isArray(result.data)
    ? /** @type {DiligenciaTipo[]} */ (result.data)
    : []
  return { ok: true, items }
}
