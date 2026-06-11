import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './BoletaReceptorModal.css'

/**
 * @param {string} value
 */
function parseMonto(value) {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : Number.NaN
}

/**
 * @param {string} value
 */
function parseDocumento(value) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return Number.NaN
  const n = Number.parseInt(digits, 10)
  return Number.isFinite(n) ? n : Number.NaN
}

/**
 * @param {import('../../../api/exhortosApi.js').BoletaReceptorItem | null | undefined} boleta
 */
function boletaToForm(boleta) {
  if (!boleta) {
    return { numeroBoleta: '', receptor: '', observaciones: '', monto: '' }
  }
  return {
    numeroBoleta: boleta.documento != null ? String(boleta.documento) : '',
    receptor: fixLegacyEncoding(boleta.receptor ?? ''),
    observaciones: fixLegacyEncoding(boleta.diligenciaEtiquetaLegacy ?? ''),
    monto: boleta.monto != null ? String(boleta.monto) : '',
  }
}

/**
 * @param {{
 *   isOpen: boolean
 *   boleta?: import('../../../api/exhortosApi.js').BoletaReceptorItem | null
 *   onClose: () => void
 *   isSaving?: boolean
 *   error?: string | null
 *   onSave: (payload: {
 *     documento: number
 *     receptor: string
 *     diligenciaEtiquetaLegacy?: string
 *     monto: number
 *   }) => void | Promise<void>
 * }} props
 */
export function BoletaReceptorModal({
  isOpen,
  boleta = null,
  onClose,
  isSaving = false,
  error = null,
  onSave,
}) {
  const titleId = useId()
  const numeroRef = useRef(null)
  const [numeroBoleta, setNumeroBoleta] = useState('')
  const [receptor, setReceptor] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [monto, setMonto] = useState('')
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null))

  const isEdit = boleta != null

  const resetFromBoleta = useCallback(() => {
    const form = boletaToForm(boleta)
    setNumeroBoleta(form.numeroBoleta)
    setReceptor(form.receptor)
    setObservaciones(form.observaciones)
    setMonto(form.monto)
    setLocalError(null)
  }, [boleta])

  useEffect(() => {
    if (!isOpen) return undefined
    resetFromBoleta()
    const t = requestAnimationFrame(() => {
      numeroRef.current?.focus()
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, resetFromBoleta])

  useEffect(() => {
    if (!isOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape' && !isSaving) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, isSaving, onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)

    const documento = parseDocumento(numeroBoleta.trim())
    const montoNum = parseMonto(monto.trim())
    const receptorTrim = receptor.trim()

    if (!numeroBoleta.trim()) {
      setLocalError('Ingresa el número de boleta.')
      return
    }
    if (!Number.isFinite(documento) || documento < 0) {
      setLocalError('El número de boleta no es válido.')
      return
    }
    if (!receptorTrim) {
      setLocalError('Ingresa el receptor.')
      return
    }
    if (!monto.trim()) {
      setLocalError('Ingresa el monto.')
      return
    }
    if (!Number.isFinite(montoNum) || montoNum < 0) {
      setLocalError('El monto no es válido.')
      return
    }

    const observacionesTrim = observaciones.trim()
    await onSave({
      documento,
      receptor: receptorTrim,
      diligenciaEtiquetaLegacy: isEdit
        ? observacionesTrim
        : observacionesTrim || undefined,
      monto: montoNum,
    })
  }

  if (!isOpen) return null

  const displayError = localError || error
  const submitLabel = isEdit ? 'MODIFICAR' : 'Guardar Boleta'

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
            {isEdit ? 'MODIFICAR BOLETA RECEPTOR' : 'BOLETA RECEPTOR'}
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
          <label className="boletaModal__field" htmlFor="boleta-numero">
            <span className="boletaModal__label">Número boleta</span>
            <input
              ref={numeroRef}
              id="boleta-numero"
              type="text"
              className="boletaModal__input"
              value={numeroBoleta}
              onChange={(ev) => {
                setNumeroBoleta(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
              inputMode="numeric"
            />
          </label>

          <label className="boletaModal__field" htmlFor="boleta-receptor">
            <span className="boletaModal__label">Receptor</span>
            <input
              id="boleta-receptor"
              type="text"
              className="boletaModal__input"
              value={receptor}
              onChange={(ev) => {
                setReceptor(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          <label className="boletaModal__field" htmlFor="boleta-observaciones">
            <span className="boletaModal__label">Observaciones</span>
            <textarea
              id="boleta-observaciones"
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

          <label className="boletaModal__field" htmlFor="boleta-monto">
            <span className="boletaModal__label">Monto</span>
            <div className="boletaModal__montoWrap">
              <span className="boletaModal__montoPrefix">$</span>
              <input
                id="boleta-monto"
                type="text"
                className="boletaModal__input"
                value={monto}
                onChange={(ev) => {
                  setMonto(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                inputMode="decimal"
              />
            </div>
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
              {isSaving ? 'Guardando…' : submitLabel}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
