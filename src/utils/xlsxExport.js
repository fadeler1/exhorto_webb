export const THIN_BORDER = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
}

/**
 * @param {string} hex Sin #, ej. "0D2142"
 */
function solidFill(hex) {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: `FF${hex}` },
  }
}

/**
 * @param {import('exceljs').Cell} cell
 * @param {{ fillHex: string; fontHex: string; bold?: boolean; size?: number; align?: 'left' | 'center'; wrap?: boolean }} opts
 */
export function styleHeaderCell(cell, opts) {
  cell.font = {
    bold: opts.bold ?? true,
    size: opts.size ?? 10,
    color: { argb: `FF${opts.fontHex}` },
  }
  cell.fill = solidFill(opts.fillHex)
  cell.border = THIN_BORDER
  cell.alignment = {
    vertical: 'middle',
    horizontal: opts.align ?? 'center',
    wrapText: opts.wrap ?? true,
  }
}

/**
 * @param {import('exceljs').Worksheet} sheet
 * @param {number} row
 * @param {number} col
 * @param {string | number} value
 * @param {{ wrap?: boolean; numFmt?: string; align?: 'left' | 'right' | 'center' }} [opts]
 */
export function writeDataCell(sheet, row, col, value, opts = {}) {
  const cell = sheet.getCell(row, col)
  cell.value = value
  cell.numFmt = opts.numFmt ?? '@'
  cell.border = THIN_BORDER
  cell.alignment = {
    vertical: 'top',
    horizontal: opts.align ?? 'left',
    wrapText: opts.wrap ?? false,
  }
}

/**
 * @param {import('exceljs').Workbook} workbook
 * @param {string} filename Debe terminar en .xlsx
 */
export async function downloadWorkbookAsXlsx(workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * @returns {Promise<typeof import('exceljs').default>}
 */
export async function loadExcelJS() {
  const { default: ExcelJS } = await import('exceljs')
  return ExcelJS
}
