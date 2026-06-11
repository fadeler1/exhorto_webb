import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './BoletaReceptorModal.css'
import './ExhortoDatosModal.css'

/**
 * @param {import('../../../api/exhortosApi.js').ExhortoListItem | import('../../../api/exhortosApi.js').ExhortoDetail} exhorto
 */
function exhortoToForm(exhorto) {
  return {
    apellidoDeudor: fixLegacyEncoding(exhorto.apellidoDeudor ?? ''),
    nombreCliente: fixLegacyEncoding(exhorto.nombreCliente ?? ''),
    tribunalOrigen: fixLegacyEncoding(exhorto.tribunalOrigen ?? ''),
    rolJuicio: fixLegacyEncoding(exhorto.rolJuicio ?? ''),
    ciudad: fixLegacyEncoding(exhorto.ciudad ?? ''),
    facultades: fixLegacyEncoding(exhorto.facultades ?? ''),
    abogado: fixLegacyEncoding(exhorto.abogado ?? ''),
  }
}

/**
 * @param {{
 *   isOpen: boolean
 *   exhorto: (import('../../../api/exhortosApi.js').ExhortoListItem | import('../../../api/exhortosApi.js').ExhortoDetail) | null
 *   onClose: () => void
 *   isSaving?: boolean
 *   error?: string | null
 *   onSave: (payload: import('../../../api/exhortosApi.js').UpdateExhortoBody) => void | Promise<void>
 * }} props
 */
export function ExhortoDatosModal({
  isOpen,
  exhorto,
  onClose,
  isSaving = false,
  error = null,
  onSave,
}) {
  const titleId = useId()
  const apellidoRef = useRef(null)
  const [apellidoDeudor, setApellidoDeudor] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [tribunalOrigen, setTribunalOrigen] = useState('')
  const [rolJuicio, setRolJuicio] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [facultades, setFacultades] = useState('')
  const [abogado, setAbogado] = useState('')
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null))

  const resetFromExhorto = useCallback(() => {
    if (!exhorto) return
    const form = exhortoToForm(exhorto)
    setApellidoDeudor(form.apellidoDeudor)
    setNombreCliente(form.nombreCliente)
    setTribunalOrigen(form.tribunalOrigen)
    setRolJuicio(form.rolJuicio)
    setCiudad(form.ciudad)
    setFacultades(form.facultades)
    setAbogado(form.abogado)
    setLocalError(null)
  }, [exhorto])

  useEffect(() => {
    if (!isOpen || !exhorto) return undefined
    resetFromExhorto()
    const t = requestAnimationFrame(() => {
      apellidoRef.current?.focus()
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, exhorto, resetFromExhorto])

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

    const apellido = apellidoDeudor.trim()
    const nombre = nombreCliente.trim()
    const tribunal = tribunalOrigen.trim()
    const rol = rolJuicio.trim()
    const ciudadTrim = ciudad.trim()
    const abogadoTrim = abogado.trim()

    if (!apellido || !nombre || !tribunal || !rol || !ciudadTrim || !abogadoTrim) {
      setLocalError('Completa todos los campos obligatorios.')
      return
    }

    await onSave({
      apellidoDeudor: apellido,
      nombreCliente: nombre,
      tribunalOrigen: tribunal,
      rolJuicio: rol,
      ciudad: ciudadTrim,
      abogado: abogadoTrim,
      facultades: facultades.trim(),
    })
  }

  if (!isOpen || !exhorto) return null

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
        className="boletaModal exhortoDatosModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="boletaModal__header">
          <h2 id={titleId} className="boletaModal__title">
            MODIFICAR EXHORTO
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

        <form className="boletaModal__body exhortoDatosModal__body" onSubmit={handleSubmit} noValidate>
          <div className="exhortoDatosModal__grid">
            <label className="boletaModal__field" htmlFor="exhorto-apellido">
              <span className="boletaModal__label">Apellido deudor</span>
              <input
                ref={apellidoRef}
                id="exhorto-apellido"
                type="text"
                className="boletaModal__input"
                value={apellidoDeudor}
                onChange={(ev) => {
                  setApellidoDeudor(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field" htmlFor="exhorto-nombre">
              <span className="boletaModal__label">Nombre cliente</span>
              <input
                id="exhorto-nombre"
                type="text"
                className="boletaModal__input"
                value={nombreCliente}
                onChange={(ev) => {
                  setNombreCliente(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field" htmlFor="exhorto-tribunal">
              <span className="boletaModal__label">Tribunal origen</span>
              <input
                id="exhorto-tribunal"
                type="text"
                className="boletaModal__input"
                value={tribunalOrigen}
                onChange={(ev) => {
                  setTribunalOrigen(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field" htmlFor="exhorto-rol">
              <span className="boletaModal__label">Rol juicio</span>
              <input
                id="exhorto-rol"
                type="text"
                className="boletaModal__input"
                value={rolJuicio}
                onChange={(ev) => {
                  setRolJuicio(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field" htmlFor="exhorto-ciudad">
              <span className="boletaModal__label">Ciudad</span>
              <input
                id="exhorto-ciudad"
                type="text"
                className="boletaModal__input"
                value={ciudad}
                onChange={(ev) => {
                  setCiudad(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field" htmlFor="exhorto-abogado">
              <span className="boletaModal__label">Abogado</span>
              <input
                id="exhorto-abogado"
                type="text"
                className="boletaModal__input"
                value={abogado}
                onChange={(ev) => {
                  setAbogado(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                required
              />
            </label>

            <label className="boletaModal__field exhortoDatosModal__field--wide" htmlFor="exhorto-facultades">
              <span className="boletaModal__label">Facultades</span>
              <input
                id="exhorto-facultades"
                type="text"
                className="boletaModal__input"
                value={facultades}
                onChange={(ev) => {
                  setFacultades(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
              />
            </label>
          </div>

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
