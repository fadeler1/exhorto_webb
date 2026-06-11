import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './BoletaReceptorModal.css'

/**
 * @param {string | null | undefined} value
 */
function fechaToInputValue(value) {
  if (!value) return ''
  const trimmed = String(value).trim()
  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slash) {
    return `${slash[3]}-${slash[2].padStart(2, '0')}-${slash[1].padStart(2, '0')}`
  }
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @param {import('../../../api/exhortosApi.js').DiligenciaItem} diligencia
 */
function diligenciaToForm(diligencia) {
  return {
    codigo: diligencia.codigo ?? '',
    fecha: fechaToInputValue(diligencia.fecha),
    observaciones: fixLegacyEncoding(diligencia.observaciones ?? ''),
  }
}

/**
 * @param {{
 *   isOpen: boolean
 *   diligencia: import('../../../api/exhortosApi.js').DiligenciaItem | null
 *   tipos: import('../../../api/catalogApi.js').DiligenciaTipo[]
 *   onClose: () => void
 *   isSaving?: boolean
 *   error?: string | null
 *   onSave: (payload: { codigo: string, fecha: string, observaciones?: string }) => void | Promise<void>
 * }} props
 */
export function DiligenciaModal({
  isOpen,
  diligencia,
  tipos,
  onClose,
  isSaving = false,
  error = null,
  onSave,
}) {
  const titleId = useId()
  const tipoRef = useRef(null)
  const [codigo, setCodigo] = useState('')
  const [fecha, setFecha] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null))

  const resetFromDiligencia = useCallback(() => {
    if (!diligencia) return
    const form = diligenciaToForm(diligencia)
    setCodigo(form.codigo)
    setFecha(form.fecha)
    setObservaciones(form.observaciones)
    setLocalError(null)
  }, [diligencia])

  useEffect(() => {
    if (!isOpen || !diligencia) return undefined
    resetFromDiligencia()
    const t = requestAnimationFrame(() => {
      tipoRef.current?.focus()
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, diligencia, resetFromDiligencia])

  useEffect(() => {
    if (!isOpen) return undefined
    function onKeyDown(ev) {
      if (ev.key === 'Escape' && !isSaving) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isSaving, onClose])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLocalError(null)

    if (!codigo) {
      setLocalError('Selecciona una diligencia.')
      return
    }
    if (!fecha) {
      setLocalError('Indica la fecha.')
      return
    }

    const observacionesTrim = observaciones.trim()
    await onSave({
      codigo,
      fecha,
      observaciones: observacionesTrim || undefined,
    })
  }

  if (!isOpen || !diligencia) return null

  const displayError = localError || error

  const modal = (
    <div className="boletaModalRoot" role="presentation">
      <button
        type="button"
        className="boletaModalRoot__backdrop"
        aria-label="Cerrar"
        onClick={isSaving ? undefined : onClose}
        disabled={isSaving}
      />
      <div
        className="boletaModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="boletaModal__header">
          <h2 id={titleId} className="boletaModal__title">
            MODIFICAR DILIGENCIA
          </h2>
          <button
            type="button"
            className="boletaModal__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <form className="boletaModal__body" onSubmit={handleSubmit} noValidate>
          <label className="boletaModal__field" htmlFor="diligencia-tipo">
            <span className="boletaModal__label">Diligencia</span>
            <select
              ref={tipoRef}
              id="diligencia-tipo"
              className="boletaModal__input"
              value={codigo}
              onChange={(ev) => {
                setCodigo(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
              required
            >
              <option value="">Seleccione diligencia</option>
              {tipos.map((t) => (
                <option key={t.codigo} value={t.codigo}>
                  {fixLegacyEncoding(t.etiquetaLegacy || t.etiqueta)}
                </option>
              ))}
            </select>
          </label>

          <label className="boletaModal__field" htmlFor="diligencia-fecha">
            <span className="boletaModal__label">Fecha</span>
            <input
              id="diligencia-fecha"
              type="date"
              className="boletaModal__input"
              value={fecha}
              onChange={(ev) => {
                setFecha(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
              required
            />
          </label>

          <label className="boletaModal__field" htmlFor="diligencia-obs">
            <span className="boletaModal__label">Observaciones</span>
            <textarea
              id="diligencia-obs"
              className="boletaModal__textarea"
              rows={4}
              value={observaciones}
              onChange={(ev) => {
                setObservaciones(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          {displayError ? (
            <p className="boletaModal__error" role="alert">
              {displayError}
            </p>
          ) : null}

          <footer className="boletaModal__footer">
            <button
              type="button"
              className="boletaModal__btn boletaModal__btn--secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="boletaModal__btn boletaModal__btn--primary"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando…' : 'MODIFICAR'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
