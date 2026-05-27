import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BOLETA_TIPO } from '../../../api/honorariosApi.js'
import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import '../../exhortos/components/BoletaReceptorModal.css'
import '../../shared/proModalSkin.css'
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
 * @param {string | Date | undefined} fecha
 */
function toDateInputValue(fecha) {
  if (!fecha) return ''
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @param {import('../../../api/honorariosApi.js').BoletaHonorarioItem | null | undefined} boleta
 */
function boletaToForm(boleta) {
  if (!boleta) {
    return { documento: '', fecha: '', pertenece: '', monto: '' }
  }
  return {
    documento: boleta.documento != null ? String(boleta.documento) : '',
    fecha: toDateInputValue(boleta.fecha),
    pertenece: fixLegacyEncoding(boleta.pertenece ?? ''),
    monto: boleta.monto != null ? String(boleta.monto) : '',
  }
}

function todayInputValue() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @param {{
 *   isOpen: boolean
 *   boleta?: import('../../../api/honorariosApi.js').BoletaHonorarioItem | null
 *   createRequest?: { tipo: number, caratula?: string } | null
 *   onClose: () => void
 *   isSaving?: boolean
 *   error?: string | null
 *   onSave: (payload: {
 *     documento: number
 *     monto: number
 *     pertenece: string
 *     fecha: string
 *   }) => void | Promise<void>
 * }} props
 */
export function BoletaHonorarioModal({
  isOpen,
  boleta = null,
  createRequest = null,
  onClose,
  isSaving = false,
  error = null,
  onSave,
}) {
  const titleId = useId()
  const numeroRef = useRef(null)
  const [documento, setDocumento] = useState('')
  const [fecha, setFecha] = useState('')
  const [pertenece, setPertenece] = useState('')
  const [monto, setMonto] = useState('')
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null))

  const resetFromBoleta = useCallback(() => {
    if (createRequest && !boleta) {
      setDocumento('')
      setFecha(todayInputValue())
      setPertenece('')
      setMonto('')
      setLocalError(null)
      return
    }
    const form = boletaToForm(boleta)
    setDocumento(form.documento)
    setFecha(form.fecha || todayInputValue())
    setPertenece(form.pertenece)
    setMonto(form.monto)
    setLocalError(null)
  }, [boleta, createRequest])

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

    const documentoNum = parseDocumento(documento.trim())
    const montoNum = parseMonto(monto.trim())
    const perteneceTrim = pertenece.trim()

    if (!documento.trim()) {
      setLocalError('Ingresa el número de boleta.')
      return
    }
    if (!Number.isFinite(documentoNum) || documentoNum < 0) {
      setLocalError('El número de boleta no es válido.')
      return
    }
    if (!fecha) {
      setLocalError('Ingresa la fecha de emisión.')
      return
    }
    if (!perteneceTrim) {
      setLocalError('Indica a quién pertenece la boleta.')
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

    await onSave({
      documento: documentoNum,
      monto: montoNum,
      pertenece: perteneceTrim,
      fecha,
    })
  }

  if (!isOpen || (!boleta && !createRequest)) return null

  const displayError = localError || error
  const tipo = boleta?.tipo ?? createRequest?.tipo ?? BOLETA_TIPO.HONORARIO
  const esDevolucion = tipo === BOLETA_TIPO.DEVOLUCION
  const modalTitle = esDevolucion ? 'BOLETA DEVOLUCIÓN' : 'BOLETA HONORARIOS'
  const submitLabel = createRequest && !boleta ? 'GUARDAR' : 'MODIFICAR'
  const caratula = createRequest?.caratula?.trim()

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
            {modalTitle}
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
          {caratula ? (
            <p className="boletaModal__context" role="note">
              Exhorto: {caratula}
            </p>
          ) : null}

          <label className="boletaModal__field" htmlFor="hon-boleta-numero">
            <span className="boletaModal__label">Número boleta</span>
            <input
              ref={numeroRef}
              id="hon-boleta-numero"
              type="text"
              className="boletaModal__input"
              value={documento}
              onChange={(ev) => {
                setDocumento(ev.target.value.replace(/\D/g, ''))
                setLocalError(null)
              }}
              disabled={isSaving}
              inputMode="numeric"
            />
          </label>

          <label className="boletaModal__field" htmlFor="hon-boleta-fecha">
            <span className="boletaModal__label">Fecha emisión</span>
            <input
              id="hon-boleta-fecha"
              type="date"
              className="boletaModal__input"
              value={fecha}
              onChange={(ev) => {
                setFecha(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          <label className="boletaModal__field" htmlFor="hon-boleta-pertenece">
            <span className="boletaModal__label">A quien</span>
            <input
              id="hon-boleta-pertenece"
              type="text"
              className="boletaModal__input"
              value={pertenece}
              onChange={(ev) => {
                setPertenece(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          <label className="boletaModal__field" htmlFor="hon-boleta-monto">
            <span className="boletaModal__label">Monto</span>
            <div className="boletaModal__montoWrap">
              <span className="boletaModal__montoPrefix">$</span>
              <input
                id="hon-boleta-monto"
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
              CANCELAR
            </button>
            <button
              type="submit"
              className="boletaModal__btn boletaModal__btn--primary"
              disabled={isSaving}
            >
              {isSaving ? 'GUARDANDO…' : submitLabel}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
