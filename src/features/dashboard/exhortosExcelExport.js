import { parseExhortoSearchResponse, searchExhortos } from '../../api/exhortosApi.js'
import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'
import { formatLegacyDate } from '../../utils/formatLegacyDate.js'
import {
  downloadWorkbookAsXlsx,
  loadExcelJS,
  styleHeaderCell,
  writeDataCell,
} from '../../utils/xlsxExport.js'

const EXPORT_PAGE_SIZE = 200

const SHEET_TITLE = 'Tramitación Exhortos A & G Asociados'

const HEADER_FILL = '0D2142'
const HEADER_FONT = 'EB5E28'

const EXCEL_COLUMNS = [
  { title: 'CLIENTE', width: 38 },
  { title: 'CIUDAD', width: 18 },
  { title: 'CARATULA', width: 70 },
  { title: 'ROL', width: 18 },
  { title: 'TRIBUNAL ORIGEN', width: 36 },
  { title: 'ABOGADO', width: 24 },
  { title: 'FACULTADES', width: 45 },
  { title: 'DILIGENCIAS', width: 120 },
]

/**
 * @param {string | null | undefined} value
 */
function text(value) {
  return fixLegacyEncoding((value ?? '').trim())
}

/**
 * @param {string | Date | null | undefined} value
 */
function dateTime(value) {
  if (!value) return 0
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? 0 : d.getTime()
}

/**
 * Orden cronológico ascendente (legacy: ORDER BY FECHA ASC).
 * Misma fecha: por código de diligencia numérico (2 antes que 3, etc.).
 * @param {import('../../api/exhortosApi.js').DiligenciaItem[]} diligencias
 */
function sortDiligencias(diligencias) {
  return [...(diligencias ?? [])].sort((a, b) => {
    const byDate = dateTime(a.fecha) - dateTime(b.fecha)
    if (byDate !== 0) return byDate

    const codeA = Number.parseInt(String(a.codigo ?? ''), 10)
    const codeB = Number.parseInt(String(b.codigo ?? ''), 10)
    if (!Number.isNaN(codeA) && !Number.isNaN(codeB)) return codeA - codeB

    return String(a.codigo ?? '').localeCompare(String(b.codigo ?? ''), 'es', {
      numeric: true,
    })
  })
}

/**
 * @param {import('../../api/exhortosApi.js').DiligenciaItem} diligencia
 */
function formatDiligenciaLine(diligencia) {
  const fecha = formatLegacyDate(diligencia.fecha)
  const diligenciaLabel = text(
    diligencia.etiquetaLegacy || diligencia.etiqueta || diligencia.codigo || '',
  )
  const observaciones = text(diligencia.observaciones)
  return `${fecha} / ${diligenciaLabel} / ${observaciones}`
}

/**
 * Todas las diligencias del exhorto en una sola celda, separadas por línea.
 * @param {import('../../api/exhortosApi.js').ExhortoListItem} row
 */
function formatDiligenciasCell(row) {
  const diligencias = sortDiligencias(row.diligencias ?? [])
  const lines = diligencias.map(formatDiligenciaLine).filter(Boolean)

  if (lines.length > 0) return lines.join('\n')

  return row.estado === 0 ? 'Terminado' : 'Vigente'
}

/**
 * @param {import('../../api/exhortosApi.js').ExhortoListItem} row
 */
function rowToExcelValues(row) {
  const cliente = text(row.nombreCliente)
  const deudor = text(row.apellidoDeudor)

  return [
    cliente,
    text(row.ciudad),
    cliente && deudor ? `${cliente} con ${deudor}` : cliente || deudor,
    text(row.rolJuicio),
    text(row.tribunalOrigen),
    text(row.abogado),
    text(row.facultades),
    formatDiligenciasCell(row),
  ]
}

/**
 * @param {import('../../api/exhortosApi.js').ExhortoListItem[]} rows
 */
export async function downloadExhortosExcel(rows) {
  const ExcelJS = await loadExcelJS()
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Tramitacion', {
    views: [{ state: 'frozen', ySplit: 2 }],
  })

  const colCount = EXCEL_COLUMNS.length

  EXCEL_COLUMNS.forEach((col, index) => {
    sheet.getColumn(index + 1).width = col.width
  })

  sheet.mergeCells(1, 1, 1, colCount)
  const titleCell = sheet.getCell(1, 1)
  titleCell.value = SHEET_TITLE
  styleHeaderCell(titleCell, {
    fillHex: HEADER_FILL,
    fontHex: HEADER_FONT,
    size: 14,
    align: 'left',
    wrap: false,
  })

  EXCEL_COLUMNS.forEach((col, index) => {
    const cell = sheet.getCell(2, index + 1)
    cell.value = col.title
    styleHeaderCell(cell, {
      fillHex: HEADER_FILL,
      fontHex: HEADER_FONT,
    })
  })

  rows.forEach((row, rowIndex) => {
    const values = rowToExcelValues(row)
    const excelRow = rowIndex + 3

    values.forEach((value, colIndex) => {
      writeDataCell(sheet, excelRow, colIndex + 1, value, {
        wrap: colIndex === colCount - 1,
      })
    })
  })

  const now = new Date()
  const filename = `tramitacion-exhortos-${now.toISOString().slice(0, 10)}.xlsx`
  await downloadWorkbookAsXlsx(workbook, filename)
}

/**
 * @param {ReturnType<import('../../api/apiClient.js').createApiClient>} apiClient
 * @param {import('../../api/exhortosApi.js').ExhortoSearchFilters} filters
 * @param {number} [knownTotal]
 */
export async function fetchAllExhortosForExport(apiClient, filters, knownTotal = 0) {
  /** @type {import('../../api/exhortosApi.js').ExhortoListItem[]} */
  const all = []
  let page = 1
  let total = knownTotal

  while (page === 1 || all.length < total) {
    const result = await searchExhortos(apiClient, {
      ...filters,
      page,
      limit: EXPORT_PAGE_SIZE,
    })

    if (!result.ok) return result

    const parsed = parseExhortoSearchResponse(result.data)
    total = parsed.total
    all.push(...parsed.data)

    if (parsed.data.length === 0 || all.length >= total) break
    page += 1
  }

  return {
    ok: true,
    status: 200,
    data: all,
  }
}
