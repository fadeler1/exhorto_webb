/**
 * Valida rango de fechas: ambas vacías o ambas con valor; desde <= hasta.
 * @param {string | undefined} desde
 * @param {string | undefined} hasta
 * @returns {string | null} mensaje de error o null si es válido
 */
export function validateFechaRango(desde, hasta) {
  const from = (desde ?? '').trim()
  const to = (hasta ?? '').trim()

  if (!from && !to) return null
  if (!from || !to) {
    return 'La fecha desde y la fecha hasta deben indicarse juntas.'
  }
  if (from > to) {
    return 'La fecha desde no puede ser posterior a la fecha hasta.'
  }
  return null
}
