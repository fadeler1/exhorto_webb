const STORAGE_KEY = 'exhorto:dashboard-search'

/**
 * @typedef {{
 *   filtros: Record<string, unknown>
 *   lastSearchFilters: Record<string, unknown>
 *   page: number
 *   hasSearched: boolean
 *   searchResult?: { data: import('../../api/exhortosApi.js').ExhortoListItem[], total: number }
 *   needsRefresh?: boolean
 * }} DashboardSearchSession
 */

/**
 * @returns {DashboardSearchSession | null}
 */
export function readDashboardSearchSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.hasSearched) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * @param {DashboardSearchSession} session
 */
export function writeDashboardSearchSession(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearDashboardSearchSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

/**
 * @param {{
 *   filtros: Record<string, unknown>
 *   lastSearchFilters: Record<string, unknown>
 *   page: number
 *   hasSearched: boolean
 *   searchResult: { data: import('../../api/exhortosApi.js').ExhortoListItem[], total: number }
 * }} snapshot
 */
export function snapshotDashboardSearch(snapshot) {
  if (!snapshot.hasSearched) return
  writeDashboardSearchSession({
    ...snapshot,
    needsRefresh: false,
  })
}

/**
 * Tras modificar un exhorto: actualiza la fila en caché y marca reconsulta al volver al listado.
 * @param {import('../../api/exhortosApi.js').ExhortoDetail} exhorto
 */
export function mergeExhortoUpdateInDashboardSession(exhorto) {
  const session = readDashboardSearchSession()
  if (!session?.hasSearched || !exhorto.id) return

  /** @type {import('../../api/exhortosApi.js').ExhortoListItem[]} */
  let data = session.searchResult?.data ?? []
  if (data.length > 0) {
    data = data.map((row) =>
      row.id === exhorto.id
        ? {
            ...row,
            apellidoDeudor: exhorto.apellidoDeudor,
            nombreCliente: exhorto.nombreCliente,
            tribunalOrigen: exhorto.tribunalOrigen,
            rolJuicio: exhorto.rolJuicio,
            ciudad: exhorto.ciudad,
            facultades: exhorto.facultades,
            abogado: exhorto.abogado,
          }
        : row,
    )
  }

  writeDashboardSearchSession({
    ...session,
    searchResult: session.searchResult
      ? { ...session.searchResult, data }
      : { data, total: data.length },
    needsRefresh: true,
  })
}
