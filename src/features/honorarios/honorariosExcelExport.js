import {
  parseHonorariosSearchResponse,
  searchHonorarios,
} from '../../api/honorariosApi.js'
import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'
import { formatLegacyDate } from '../../utils/formatLegacyDate.js'
import {
  downloadWorkbookAsXlsx,
  loadExcelJS,
  styleHeaderCell,
  writeDataCell,
} from '../../utils/xlsxExport.js'

const SHEET_TITLE = 'Boletas Tramitación Exhortos A & G Asociados'

const TITLE_FILL = '220835'
const TITLE_FONT = 'FFFFFF'
const HEADER_FILL = '431A5D'
const HEADER_FONT = 'FFFFFF'

const EXCEL_COLUMNS = [
  { title: 'CARATULA', width: 52 },
  { title: 'CIUDAD', width: 18 },
  { title: 'FECHA', width: 14 },
  { title: 'BOLETA', width: 12 },
  { title: 'MONTO', width: 12 },
  { title: 'ABOGADO', width: 28 },
]

/**
 * @param {string | null | undefined} value
 */
function text(value) {
  return fixLegacyEncoding((value ?? '').trim())
}

/**
 * @param {import('../../api/honorariosApi.js').BoletaHonorarioItem} row
 */
function formatCaratula(row) {
  const ex = row.exhorto
  if (!ex) return ''
  const cliente = text(ex.nombreCliente)
  const deudor = text(ex.apellidoDeudor)
  if (cliente && deudor) return `${cliente} / ${deudor}`
  return cliente || deudor
}

/**
 * @param {number | null | undefined} monto
 */
function formatMonto(monto) {
  if (typeof monto !== 'number' || !Number.isFinite(monto)) return null
  return Math.round(monto)
}

/**
 * @param {import('../../api/honorariosApi.js').BoletaHonorarioItem} row
 */
function rowToExcelValues(row) {
  const ex = row.exhorto
  return [
    formatCaratula(row),
    text(ex?.ciudad),
    formatLegacyDate(row.fecha),
    row.documento != null ? String(row.documento) : '',
    formatMonto(row.monto),
    text(ex?.abogado),
  ]
}

/**
 * @param {import('../../api/honorariosApi.js').BoletaHonorarioItem[]} rows
 */
export async function downloadHonorariosExcel(rows) {
  const ExcelJS = await loadExcelJS()
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Boletas', {
    views: [{ state: 'frozen', ySplit: 3 }],
  })

  const colCount = EXCEL_COLUMNS.length

  EXCEL_COLUMNS.forEach((col, index) => {
    sheet.getColumn(index + 1).width = col.width
  })

  sheet.mergeCells(1, 1, 1, colCount)
  const titleCell = sheet.getCell(1, 1)
  titleCell.value = SHEET_TITLE
  styleHeaderCell(titleCell, {
    fillHex: TITLE_FILL,
    fontHex: TITLE_FONT,
    size: 14,
    align: 'left',
    wrap: false,
  })

  sheet.getRow(2).height = 6

  EXCEL_COLUMNS.forEach((col, index) => {
    const cell = sheet.getCell(3, index + 1)
    cell.value = col.title
    styleHeaderCell(cell, {
      fillHex: HEADER_FILL,
      fontHex: HEADER_FONT,
    })
  })

  rows.forEach((row, rowIndex) => {
    const values = rowToExcelValues(row)
    const excelRow = rowIndex + 4

    values.forEach((value, colIndex) => {
      if (colIndex === 4 && typeof value === 'number') {
        writeDataCell(sheet, excelRow, colIndex + 1, value, {
          numFmt: '0',
          align: 'right',
        })
        return
      }

      writeDataCell(sheet, excelRow, colIndex + 1, value == null ? '' : String(value))
    })
  })

  const now = new Date()
  const filename = `boletas-honorarios-${now.toISOString().slice(0, 10)}.xlsx`
  await downloadWorkbookAsXlsx(workbook, filename)
}

/**
 * Una sola petición GET /honorarios?export=true con los filtros de búsqueda.
 * @param {ReturnType<import('../../api/apiClient.js').createApiClient>} apiClient
 * @param {import('../../api/honorariosApi.js').HonorariosSearchFilters} filters
 */
export async function fetchHonorariosForExport(apiClient, filters) {
  const result = await searchHonorarios(apiClient, {
    ...filters,
    page: undefined,
    limit: undefined,
    export: true,
  })

  if (!result.ok) return result

  const parsed = parseHonorariosSearchResponse(result)
  return {
    ok: true,
    status: 200,
    data: parsed.data,
  }
}
