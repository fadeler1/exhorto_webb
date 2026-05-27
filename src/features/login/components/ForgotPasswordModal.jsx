import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './ForgotPasswordModal.css'

const DEFAULT_SUCCESS_MESSAGE =
  'Si existe una cuenta asociada a ese correo, recibirás un mensaje con instrucciones para restablecer tu contraseña.'

/**
 * @param {{
 *   isOpen: boolean
 *   onClose: () => void
 * }} props
 */
export function ForgotPasswordModal({ isOpen, onClose }) {
  const titleId = useId()
  const emailInputRef = useRef(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState(DEFAULT_SUCCESS_MESSAGE)
  const [isSending, setIsSending] = useState(false)

  const reset = useCallback(() => {
    setEmail('')
    setError(null)
    setSuccess(false)
    setSuccessMessage(DEFAULT_SUCCESS_MESSAGE)
    setIsSending(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    const t = requestAnimationFrame(() => {
      emailInputRef.current?.focus()
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, reset])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleSend(e) {
    e.preventDefault()
    setError(null)
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Ingresa tu correo electrónico.')
      return
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!ok) {
      setError('Introduce un correo electrónico válido.')
      return
    }

    setIsSending(true)
    try {
      const baseRaw = import.meta.env.VITE_API_BASE_URL ?? ''
      const base = typeof baseRaw === 'string' ? baseRaw.replace(/\/$/, '') : ''
      const path = import.meta.env.VITE_AUTH_FORGOT_PATH ?? ''

      if (path && base) {
        const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email: trimmed }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          const msg =
            typeof data.message === 'string'
              ? data.message
              : 'No se pudo enviar la solicitud. Intenta más tarde.'
          setError(msg)
          return
        }
        const serverMsg =
          typeof data.message === 'string' && data.message.trim() !== ''
            ? data.message
            : DEFAULT_SUCCESS_MESSAGE
        setSuccessMessage(serverMsg)
      } else {
        await new Promise((r) => setTimeout(r, 500))
        setSuccessMessage(DEFAULT_SUCCESS_MESSAGE)
      }
      setSuccess(true)
    } catch {
      setError('Error de red. Verifica tu conexión.')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  const modal = (
    <div className="forgotModalRoot" role="presentation">
      <button
        type="button"
        className="forgotModalRoot__backdrop"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className="forgotModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="forgotModal__header">
          <div className="forgotModal__headerText">
            <p className="forgotModal__eyebrow">A &amp; G Asociados</p>
            <h2 id={titleId} className="forgotModal__title">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="forgotModal__subtitle">
              Te enviaremos instrucciones al correo registrado
            </p>
          </div>
          <button
            type="button"
            className="forgotModal__close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form className="forgotModal__body" onSubmit={handleSend} noValidate>
          {success ? (
            <p className="forgotModal__success" role="status">
              {successMessage}
            </p>
          ) : (
            <>
              <p className="forgotModal__hint">
                Introduzca su dirección de correo electrónico para restablecer la
                contraseña.
              </p>
              <label className="forgotModal__label" htmlFor="forgot-modal-email">
                Email
              </label>
              <input
                ref={emailInputRef}
                id="forgot-modal-email"
                name="email"
                type="email"
                autoComplete="email"
                className="forgotModal__input"
                placeholder="Email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value)
                  setError(null)
                }}
                disabled={isSending}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'forgot-modal-error' : undefined}
              />
              {error ? (
                <p id="forgot-modal-error" className="forgotModal__error" role="alert">
                  {error}
                </p>
              ) : null}
            </>
          )}

          <footer className="forgotModal__footer">
            <button
              type="button"
              className="forgotModal__btn forgotModal__btn--secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            {success ? (
              <button
                type="button"
                className="forgotModal__btn forgotModal__btn--primary"
                onClick={onClose}
              >
                Aceptar
              </button>
            ) : (
              <button
                type="submit"
                className="forgotModal__btn forgotModal__btn--primary"
                disabled={isSending}
              >
                {isSending ? 'Enviando…' : 'Enviar'}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
