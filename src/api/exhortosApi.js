/**
 * @typedef {{
 *   apellidoDeudor?: string
 *   nombreCliente?: string
 *   tribunalOrigen?: string
 *   rolJuicio?: string
 *   ciudad?: string
 *   facultades?: string
 *   abogado?: string
 *   terminado?: boolean
 *   vigente?: boolean
 *   desde?: string
 *   hasta?: string
 *   diligenciaCodigo?: string
 *   page?: number
 *   limit?: number
 * }} ExhortoSearchFilters
 */

/**
 * @typedef {{
 *   id: string
 *   codigo: string
 *   etiqueta?: string
 *   etiquetaLegacy: string
 *   fecha: string
 *   observaciones?: string
 *   usuario: string
 * }} DiligenciaItem
 */

/**
 * @typedef {{
 *   id: string
 *   receptor: string
 *   documento: number
 *   monto: number
 *   diligenciaCodigo: string
 *   diligenciaEtiquetaLegacy: string
 * }} BoletaReceptorItem
 */

/**
 * @typedef {{
 *   id?: string
 *   apellidoDeudor?: string
 *   nombreCliente?: string
 *   rolJuicio?: string
 *   ciudad?: string
 *   abogado?: string
 *   tribunalOrigen?: string
 *   facultades?: string
 *   estado?: number
 *   diligencias?: DiligenciaItem[]
 *   tieneBoletaHonorario?: boolean
 *   tieneBoletaDevolucion?: boolean
 * }} ExhortoListItem
 */

/**
 * @typedef {ExhortoListItem & {
 *   id: string
 *   diligencias: DiligenciaItem[]
 *   boletasReceptor: BoletaReceptorItem[]
 * }} ExhortoDetail
 */

/**
 * @typedef {{ data: ExhortoListItem[], total: number }} ExhortoSearchResult
 */

/**
 * @typedef {{
 *   matched: number
 *   moved: number
 *   deleted: number
 * }} ExhortoBackupMoveResult
 */

/**
 * @typedef {{
 *   fechaDesde?: string
 *   fechaHasta?: string
 *   estado?: number
 *   diligenciaCodigo?: string
 *   page?: number
 *   limit?: number
 * }} ExhortoBackupSearchFilters
 */

/**
 * @typedef {{
 *   nombre: string
 *   total: number
 *   vigente: number
 *   terminado: number
 * }} ExhortoAttributeStat
 */

/**
 * @typedef {{
 *   resumen: { total: number, vigente: number, terminado: number }
 *   porCiudad: ExhortoAttributeStat[]
 *   porAbogado: ExhortoAttributeStat[]
 *   porTribunal: ExhortoAttributeStat[]
 *   porFacultades: ExhortoAttributeStat[]
 *   recientes: Array<{
 *     id: string
 *     apellidoDeudor: string
 *     nombreCliente: string
 *     ciudad: string
 *     abogado: string
 *     estado: number
 *     createdAt?: string
 *   }>
 * }} ExhortoDashboardStats
 */

/**
 * Query alineado con Postman/curl:
 * GET /api/exhortos?apellidoDeudor=&nombreCliente=&ciudad=&abogado=&estado=1&page=1&limit=20
 *
 * @param {ExhortoSearchFilters} filters
 * @returns {Record<string, string>}
 */
export function buildExhortoSearchParams(filters) {
  const trim = (v) => (typeof v === 'string' ? v.trim() : '')

  /** @type {Record<string, string>} */
  const params = {
    apellidoDeudor: trim(filters.apellidoDeudor),
    nombreCliente: trim(filters.nombreCliente),
    ciudad: trim(filters.ciudad),
    abogado: trim(filters.abogado),
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 20),
  }

  const tribunal = trim(filters.tribunalOrigen)
  if (tribunal) params.tribunalOrigen = tribunal

  const rol = trim(filters.rolJuicio)
  if (rol) params.rolJuicio = rol

  const facultades = trim(filters.facultades)
  if (facultades) params.facultades = facultades

  if (filters.terminado && !filters.vigente) {
    params.estado = '0'
  } else if (filters.vigente && !filters.terminado) {
    params.estado = '1'
  } else if (!filters.terminado && !filters.vigente) {
    params.estado = '1'
  }

  if (filters.desde) params.fechaDesde = filters.desde
  if (filters.hasta) params.fechaHasta = filters.hasta

  const diligenciaCodigo = trim(filters.diligenciaCodigo)
  if (diligenciaCodigo) params.diligenciaCodigo = diligenciaCodigo

  return params
}

/**
 * @param {unknown} payload
 * @returns {ExhortoSearchResult}
 */
export function parseExhortoSearchResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      data: /** @type {ExhortoListItem[]} */ (payload),
      total: payload.length,
    }
  }
  if (!payload || typeof payload !== 'object') {
    return { data: [], total: 0 }
  }
  const o = /** @type {Record<string, unknown>} */ (payload)
  const data = Array.isArray(o.data) ? /** @type {ExhortoListItem[]} */ (o.data) : []
  const total = typeof o.total === 'number' ? o.total : data.length
  return { data, total }
}

/**
 * GET /exhortos con Authorization Bearer.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {ExhortoSearchFilters} filters
 */
export async function searchExhortos(apiClient, filters) {
  const params = buildExhortoSearchParams(filters)
  const qs = new URLSearchParams(params).toString()
  return apiClient.get(`/exhortos?${qs}`)
}

/**
 * GET /exhortos/respaldo/buscar — consulta colección respaldo_exhorto.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {ExhortoBackupSearchFilters} filters
 */
export async function searchExhortosBackup(apiClient, filters) {
  const params = new URLSearchParams()
  if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde)
  if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta)
  if (typeof filters.estado === 'number') params.set('estado', String(filters.estado))
  if (filters.diligenciaCodigo) params.set('diligenciaCodigo', filters.diligenciaCodigo)
  params.set('page', String(filters.page ?? 1))
  params.set('limit', String(filters.limit ?? 20))
  return apiClient.get(`/exhortos/respaldo/buscar?${params.toString()}`)
}

/**
 * @param {unknown} payload
 * @returns {ExhortoDetail | null}
 */
export function parseExhortoDetail(payload) {
  if (!payload || typeof payload !== 'object') return null
  const o = /** @type {Record<string, unknown>} */ (payload)
  const id = typeof o.id === 'string' ? o.id : ''
  if (!id) return null
  const diligencias = Array.isArray(o.diligencias)
    ? /** @type {DiligenciaItem[]} */ (o.diligencias)
    : []
  const boletasReceptor = Array.isArray(o.boletasReceptor)
    ? o.boletasReceptor
        .map((b) => parseBoletaReceptorItem(b))
        .filter((b) => b != null)
    : []
  return {
    id,
    apellidoDeudor: typeof o.apellidoDeudor === 'string' ? o.apellidoDeudor : '',
    nombreCliente: typeof o.nombreCliente === 'string' ? o.nombreCliente : '',
    tribunalOrigen: typeof o.tribunalOrigen === 'string' ? o.tribunalOrigen : '',
    rolJuicio: typeof o.rolJuicio === 'string' ? o.rolJuicio : '',
    ciudad: typeof o.ciudad === 'string' ? o.ciudad : '',
    facultades: typeof o.facultades === 'string' ? o.facultades : '',
    abogado: typeof o.abogado === 'string' ? o.abogado : '',
    estado: typeof o.estado === 'number' ? o.estado : undefined,
    diligencias,
    boletasReceptor,
  }
}

/**
 * @param {unknown} payload
 * @returns {BoletaReceptorItem | null}
 */
export function parseBoletaReceptorItem(payload) {
  if (!payload || typeof payload !== 'object') return null
  const b = /** @type {Record<string, unknown>} */ (payload)
  const id = typeof b.id === 'string' ? b.id : ''
  if (!id) return null
  return {
    id,
    receptor: typeof b.receptor === 'string' ? b.receptor : '',
    documento: typeof b.documento === 'number' ? b.documento : 0,
    monto: typeof b.monto === 'number' ? b.monto : 0,
    diligenciaCodigo: typeof b.diligenciaCodigo === 'string' ? b.diligenciaCodigo : '',
    diligenciaEtiquetaLegacy:
      typeof b.diligenciaEtiquetaLegacy === 'string' ? b.diligenciaEtiquetaLegacy : '',
  }
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 */
export async function fetchExhortoById(apiClient, exhortoId) {
  return apiClient.get(`/exhortos/${exhortoId}`)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 */
export async function deleteExhorto(apiClient, exhortoId) {
  return apiClient.delete(`/exhortos/${exhortoId}`)
}

/**
 * Mueve exhortos terminados con diligencias dentro del rango hacia respaldo_exhorto.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {{ fechaDesde: string, fechaHasta: string, diligenciaCodigo?: string }} body
 */
export async function moveExhortosToBackup(apiClient, body) {
  return apiClient.post('/exhortos/respaldo/mover', body)
}

/**
 * Recupera exhortos desde respaldo_exhorto hacia la colección principal exhortos.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {{ fechaDesde: string, fechaHasta: string, estado: number, diligenciaCodigo?: string }} body
 */
export async function recoverExhortosFromBackup(apiClient, body) {
  return apiClient.post('/exhortos/respaldo/recuperar', body)
}

/**
 * @typedef {{
 *   apellidoDeudor: string
 *   nombreCliente: string
 *   tribunalOrigen: string
 *   rolJuicio: string
 *   ciudad: string
 *   facultades?: string
 *   abogado: string
 *   rut?: string
 * }} CreateExhortoBody
 */

/**
 * POST /exhortos — crea un exhorto vigente en MongoDB.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {CreateExhortoBody} body
 */
export async function createExhorto(apiClient, body) {
  return apiClient.post('/exhortos', body)
}

/**
 * @typedef {{
 *   apellidoDeudor?: string
 *   nombreCliente?: string
 *   tribunalOrigen?: string
 *   rolJuicio?: string
 *   ciudad?: string
 *   facultades?: string
 *   abogado?: string
 *   rut?: string
 * }} UpdateExhortoBody
 */

/**
 * PATCH /exhortos/:id — actualiza datos maestros del exhorto.
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {UpdateExhortoBody} body
 */
export async function updateExhorto(apiClient, exhortoId, body) {
  return apiClient.patch(`/exhortos/${exhortoId}`, body)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {{ codigo: string, fecha: string, observaciones?: string }} body
 */
export async function addDiligencia(apiClient, exhortoId, body) {
  return apiClient.post(`/exhortos/${exhortoId}/diligencias`, body)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {string} diligenciaId
 */
export async function removeDiligencia(apiClient, exhortoId, diligenciaId) {
  return apiClient.delete(`/exhortos/${exhortoId}/diligencias/${diligenciaId}`)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {{
 *   receptor: string
 *   documento: number
 *   monto: number
 *   diligenciaEtiquetaLegacy?: string
 * }} body
 */
export async function addBoletaReceptor(apiClient, exhortoId, body) {
  return apiClient.post(`/exhortos/${exhortoId}/boletas-receptor`, body)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {string} boletaId
 * @param {{
 *   receptor?: string
 *   documento?: number
 *   monto?: number
 *   diligenciaEtiquetaLegacy?: string
 * }} body
 */
export async function updateBoletaReceptor(apiClient, exhortoId, boletaId, body) {
  return apiClient.patch(`/exhortos/${exhortoId}/boletas-receptor/${boletaId}`, body)
}

/**
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 * @param {string} exhortoId
 * @param {string} boletaId
 */
export async function removeBoletaReceptor(apiClient, exhortoId, boletaId) {
  return apiClient.delete(`/exhortos/${exhortoId}/boletas-receptor/${boletaId}`)
}

/**
 * @param {unknown} payload
 * @returns {ExhortoDashboardStats | null}
 */
export function parseDashboardStats(payload) {
  if (!payload || typeof payload !== 'object') return null
  const o = /** @type {Record<string, unknown>} */ (payload)

  const parseAttr = (arr) =>
    Array.isArray(arr)
      ? /** @type {ExhortoAttributeStat[]} */ (
          arr
            .map((item) => {
              if (!item || typeof item !== 'object') return null
              const row = /** @type {Record<string, unknown>} */ (item)
              const nombre = typeof row.nombre === 'string' ? row.nombre : ''
              return {
                nombre,
                total: typeof row.total === 'number' ? row.total : 0,
                vigente: typeof row.vigente === 'number' ? row.vigente : 0,
                terminado: typeof row.terminado === 'number' ? row.terminado : 0,
              }
            })
            .filter(Boolean)
        )
      : []

  const resumenRaw =
    o.resumen && typeof o.resumen === 'object'
      ? /** @type {Record<string, unknown>} */ (o.resumen)
      : null

  const recientes = Array.isArray(o.recientes)
    ? o.recientes
        .map((item) => {
          if (!item || typeof item !== 'object') return null
          const r = /** @type {Record<string, unknown>} */ (item)
          const id = typeof r.id === 'string' ? r.id : ''
          if (!id) return null
          return {
            id,
            apellidoDeudor:
              typeof r.apellidoDeudor === 'string' ? r.apellidoDeudor : '',
            nombreCliente: typeof r.nombreCliente === 'string' ? r.nombreCliente : '',
            ciudad: typeof r.ciudad === 'string' ? r.ciudad : '',
            abogado: typeof r.abogado === 'string' ? r.abogado : '',
            estado: typeof r.estado === 'number' ? r.estado : 1,
            createdAt:
              typeof r.createdAt === 'string'
                ? r.createdAt
                : r.createdAt instanceof Date
                  ? r.createdAt.toISOString()
                  : undefined,
          }
        })
        .filter(Boolean)
    : []

  return {
    resumen: {
      total: typeof resumenRaw?.total === 'number' ? resumenRaw.total : 0,
      vigente: typeof resumenRaw?.vigente === 'number' ? resumenRaw.vigente : 0,
      terminado: typeof resumenRaw?.terminado === 'number' ? resumenRaw.terminado : 0,
    },
    porCiudad: parseAttr(o.porCiudad),
    porAbogado: parseAttr(o.porAbogado),
    porTribunal: parseAttr(o.porTribunal),
    porFacultades: parseAttr(o.porFacultades),
    recientes,
  }
}

/**
 * GET /exhortos/dashboard/stats
 * @param {ReturnType<import('./apiClient.js').createApiClient>} apiClient
 */
export async function fetchExhortoDashboardStats(apiClient) {
  return apiClient.get('/exhortos/dashboard/stats')
}
