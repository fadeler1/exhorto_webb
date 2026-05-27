/**
 * @typedef {{
 *   ciudad?: string
 *   abogado?: string
 *   caratula?: string
 *   rolJuicio?: string
 *   documento?: number
 *   pendiente?: boolean
 *   pagada?: boolean
 *   honorarios?: boolean
 *   devolucion?: boolean
 *   page?: number
 *   limit?: number
 *   export?: boolean
 * }} HonorariosSearchFilters
 */

/**
 * @typedef {{
 *   id: string
 *   exhortoId: string
 *   documento: number
 *   monto: number
 *   estado: number
 *   tipo: number
 *   pertenece: string
 *   fecha: string
 *   exhorto?: {
 *     apellidoDeudor: string
 *     nombreCliente: string
 *     abogado: string
 *     ciudad: string
 *     rolJuicio?: string
 *     estado: number
 *   }
 * }} BoletaHonorarioItem
 */

/**
 * @typedef {{ data: BoletaHonorarioItem[], total: number }} HonorariosSearchResult
 */

const BOLETA_ESTADO = {
  PENDIENTE: 0,
  PAGADO: 1,
}

export const BOLETA_TIPO = {
  HONORARIO: 1,
  DEVOLUCION: 2,
}

/**
 * Lógica de filtros alineada al legado (honorarios.php / BuscadorHonorario.php).
 * @param {HonorariosSearchFilters} filters
 */
export function buildHonorariosSearchQuery(filters) {
  /** @type {Record<string, string | number>} */
  const query = {}

  const ciudad = filters.ciudad?.trim()
  if (ciudad) query.ciudad = ciudad

  const abogado = filters.abogado?.trim()
  if (abogado) query.abogado = abogado

  const caratula = filters.caratula?.trim()
  if (caratula) query.caratula = caratula

  const rolJuicio = filters.rolJuicio?.trim()
  if (rolJuicio) query.rolJuicio = rolJuicio

  const docRaw = filters.documento
  if (docRaw !== undefined && docRaw !== null && String(docRaw).trim() !== '') {
    const doc = Number(docRaw)
    if (!Number.isNaN(doc)) query.documento = doc
  }

  const pendiente = Boolean(filters.pendiente)
  const pagada = Boolean(filters.pagada)
  if (pendiente && !pagada) {
    query.estado = BOLETA_ESTADO.PENDIENTE
  } else if (!pendiente && pagada) {
    query.estado = BOLETA_ESTADO.PAGADO
  }

  const honorarios = Boolean(filters.honorarios)
  const devolucion = Boolean(filters.devolucion)
  if (honorarios && !devolucion) {
    query.tipo = BOLETA_TIPO.HONORARIO
  } else if (!honorarios && devolucion) {
    query.tipo = BOLETA_TIPO.DEVOLUCION
  }

  if (filters.page) query.page = filters.page
  if (filters.limit) query.limit = filters.limit
  if (filters.export) query.export = 'true'

  return query
}

/**
 * @param {import('./apiClient.js').ApiResult} result
 * @returns {HonorariosSearchResult}
 */
export function parseHonorariosSearchResponse(result) {
  if (!result.ok) {
    return { data: [], total: 0 }
  }
  const payload = result.data
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const o = /** @type {Record<string, unknown>} */ (payload)
    const data = Array.isArray(o.data) ? o.data : []
    const total = typeof o.total === 'number' ? o.total : data.length
    return { data, total }
  }
  if (Array.isArray(payload)) {
    return { data: payload, total: payload.length }
  }
  return { data: [], total: 0 }
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {HonorariosSearchFilters} filters
 */
export async function searchHonorarios(apiClient, filters) {
  const query = buildHonorariosSearchQuery(filters)
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value))
  }
  const qs = params.toString()
  return apiClient.get(`/honorarios${qs ? `?${qs}` : ''}`)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} id
 */
export function payHonorario(apiClient, id) {
  return apiClient.post(`/honorarios/${id}/pagar`, {})
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} id
 */
export function deleteHonorario(apiClient, id) {
  return apiClient.delete(`/honorarios/${id}`)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} id
 * @param {{
 *   documento: number
 *   monto: number
 *   pertenece: string
 *   fecha: string
 * }} payload
 */
export function updateHonorario(apiClient, id, payload) {
  return apiClient.patch(`/honorarios/${id}`, payload)
}

/**
 * POST /honorarios — ingresa boleta honorario (tipo 1) o devolución (tipo 2).
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {{
 *   exhortoId: string
 *   documento: number
 *   monto: number
 *   pertenece: string
 *   fecha: string
 *   tipo: typeof BOLETA_TIPO.HONORARIO | typeof BOLETA_TIPO.DEVOLUCION
 * }} payload
 */
export function createHonorario(apiClient, payload) {
  return apiClient.post('/honorarios', payload)
}
