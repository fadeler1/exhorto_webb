/**
 * Formato de fecha del sistema legacy (MySQL date_format '%d/%m/%Y').
 * @param {string | Date | null | undefined} value
 */
export function formatLegacyDate(value) {
  if (!value) return ''

  const trimmed = String(value).trim()
  const slashParts = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashParts) {
    const day = slashParts[1].padStart(2, '0')
    const month = slashParts[2].padStart(2, '0')
    const year = slashParts[3]
    return `${day}/${month}/${year}`
  }

  const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDate) {
    return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`
  }

  const d = value instanceof Date ? value : new Date(trimmed)
  if (Number.isNaN(d.getTime())) return trimmed

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
