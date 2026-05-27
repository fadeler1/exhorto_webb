import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'

/**
 * @param {{
 *   value: string
 *   onChange: (value: string) => void
 *   tipos: import('../../api/catalogApi.js').DiligenciaTipo[]
 *   disabled?: boolean
 *   className?: string
 *   emptyLabel?: string
 * }} props
 */
export function DiligenciaTipoSelect({
  value,
  onChange,
  tipos,
  disabled = false,
  className = 'dashField__input',
  emptyLabel = 'Todas',
}) {
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{emptyLabel}</option>
      {tipos.map((t) => (
        <option key={t.codigo} value={t.codigo}>
          {fixLegacyEncoding(t.etiquetaLegacy || t.etiqueta)}
        </option>
      ))}
    </select>
  )
}

/**
 * @param {string} codigo
 * @param {import('../../api/catalogApi.js').DiligenciaTipo[]} tipos
 */
export function getDiligenciaTipoLabel(codigo, tipos) {
  if (!codigo) return ''
  const item = tipos.find((t) => t.codigo === codigo)
  if (!item) return `Código ${codigo}`
  return fixLegacyEncoding(item.etiquetaLegacy || item.etiqueta)
}
