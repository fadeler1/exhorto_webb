/** @typedef {import('../../api/exhortosApi.js').ExhortoSearchFilters} ExhortoSearchFilters */

/**
 * @param {Record<string, unknown>} filters
 */
function normalizeExhortoFilters(filters) {
  return {
    apellidoDeudor: String(filters.apellidoDeudor ?? '').trim(),
    nombreCliente: String(filters.nombreCliente ?? '').trim(),
    tribunalOrigen: String(filters.tribunalOrigen ?? '').trim(),
    rolJuicio: String(filters.rolJuicio ?? '').trim(),
    ciudad: String(filters.ciudad ?? '').trim(),
    facultades: String(filters.facultades ?? '').trim(),
    abogado: String(filters.abogado ?? '').trim(),
    desde: String(filters.desde ?? ''),
    hasta: String(filters.hasta ?? ''),
    diligenciaCodigo: String(filters.diligenciaCodigo ?? '').trim(),
    terminado: Boolean(filters.terminado),
    vigente: Boolean(filters.vigente),
  }
}

/**
 * @param {Record<string, unknown>} a
 * @param {Record<string, unknown>} b
 */
export function areExhortoFiltersEqual(a, b) {
  const left = normalizeExhortoFilters(a)
  const right = normalizeExhortoFilters(b)
  return (
    left.apellidoDeudor === right.apellidoDeudor &&
    left.nombreCliente === right.nombreCliente &&
    left.tribunalOrigen === right.tribunalOrigen &&
    left.rolJuicio === right.rolJuicio &&
    left.ciudad === right.ciudad &&
    left.facultades === right.facultades &&
    left.abogado === right.abogado &&
    left.desde === right.desde &&
    left.hasta === right.hasta &&
    left.diligenciaCodigo === right.diligenciaCodigo &&
    left.terminado === right.terminado &&
    left.vigente === right.vigente
  )
}

/**
 * @param {Record<string, unknown>} filters
 */
export function describeExhortoEstadoFilters(filters) {
  const terminado = Boolean(filters.terminado)
  const vigente = Boolean(filters.vigente)
  if (terminado && vigente) return 'Vigentes y terminados'
  if (terminado) return 'Terminados'
  if (vigente) return 'Vigentes'
  return 'Vigentes (predeterminado)'
}

/**
 * @param {Record<string, unknown>} filters
 * @returns {string[]}
 */
export function listActiveExhortoFilterLabels(filters) {
  const normalized = normalizeExhortoFilters(filters)
  /** @type {string[]} */
  const labels = []

  if (normalized.apellidoDeudor) {
    labels.push(`Deudor: ${normalized.apellidoDeudor}`)
  }
  if (normalized.nombreCliente) {
    labels.push(`Cliente: ${normalized.nombreCliente}`)
  }
  if (normalized.tribunalOrigen) {
    labels.push(`Tribunal: ${normalized.tribunalOrigen}`)
  }
  if (normalized.rolJuicio) {
    labels.push(`Rol: ${normalized.rolJuicio}`)
  }
  if (normalized.ciudad) {
    labels.push(`Ciudad: ${normalized.ciudad}`)
  }
  if (normalized.facultades) {
    labels.push(`Facultades: ${normalized.facultades}`)
  }
  if (normalized.abogado) {
    labels.push(`Abogado: ${normalized.abogado}`)
  }
  if (normalized.desde || normalized.hasta) {
    labels.push(
      `Fechas: ${normalized.desde || '…'} – ${normalized.hasta || '…'}`,
    )
  }
  if (normalized.diligenciaCodigo) {
    labels.push(`Diligencia: ${normalized.diligenciaCodigo}`)
  }

  labels.push(`Estado: ${describeExhortoEstadoFilters(normalized)}`)
  return labels
}
