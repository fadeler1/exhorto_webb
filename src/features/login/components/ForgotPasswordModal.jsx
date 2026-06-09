import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createPasswordRecoveryApi } from '../../../auth/infrastructure/passwordRecoveryApi.js'
import { CODE_LENGTH, RecoveryCodeInput } from './RecoveryCodeInput.jsx'
import './ForgotPasswordModal.css'

/** @typedef {'email' | 'code' | 'password' | 'done'} RecoveryStep */

const DEFAULT_EMAIL_SUCCESS =
  'Se envió un correo con el código para restablecer la contraseña. Revisa tu bandeja de entrada y la carpeta de spam.'

const EMAIL_NOT_FOUND_MESSAGE =
  'No está registrado con ese email. Contacte al administrador del sitio.'

const STEP_COPY = {
  email: {
    title: '¿Olvidaste tu contraseña?',
    subtitle: 'Te enviaremos instrucciones al correo registrado',
  },
  code: {
    title: 'Ingresa el código',
    subtitle: 'Revisa tu bandeja de entrada y escribe el código recibido',
  },
  password: {
    title: 'Nueva contraseña',
    subtitle: 'Elige una contraseña segura para tu cuenta',
  },
  done: {
    title: 'Contraseña actualizada',
    subtitle: 'Ya puedes iniciar sesión con tu nueva contraseña',
  },
}

/**
 * @param {{
 *   isOpen: boolean
 *   onClose: () => void
 * }} props
 */
export function ForgotPasswordModal({ isOpen, onClose }) {
  const titleId = useId()
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null))
  const codeInputRef = useRef(/** @type {HTMLInputElement | null} */ (null))
  const recoveryApi = useMemo(() => createPasswordRecoveryApi(), [])

  const [step, setStep] = useState(/** @type {RecoveryStep} */ ('email'))
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [infoMessage, setInfoMessage] = useState(DEFAULT_EMAIL_SUCCESS)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const copy = STEP_COPY[step]

  const reset = useCallback(() => {
    setStep('email')
    setEmail('')
    setCodigo('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setInfoMessage(DEFAULT_EMAIL_SUCCESS)
    setIsSubmitting(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    const t = requestAnimationFrame(() => {
      if (step === 'code') {
        codeInputRef.current?.focus()
      } else {
        inputRef.current?.focus()
      }
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, reset, step])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError(null)
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Ingresa tu correo electrónico.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Introduce un correo electrónico válido.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await recoveryApi.forgotPassword(trimmed)
      if (!result.ok) {
        const isNotFound =
          result.status === 404 ||
          /no está registrado|no existe|not found/i.test(result.message)
        setError(isNotFound ? EMAIL_NOT_FOUND_MESSAGE : result.message)
        return
      }
      const serverMsg =
        typeof result.data.message === 'string' && result.data.message.trim() !== ''
          ? result.data.message
          : DEFAULT_EMAIL_SUCCESS
      setEmail(trimmed)
      setInfoMessage(serverMsg)
      setCodigo('')
      setStep('code')
    } catch {
      setError('Error de red. Verifica tu conexión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCodeSubmit(e) {
    e.preventDefault()
    setError(null)
    const trimmedCode = codigo.trim()
    if (trimmedCode.length !== CODE_LENGTH) {
      setError(`Ingresa el código de ${CODE_LENGTH} dígitos recibido por correo.`)
      return
    }
    const codigoNum = Number.parseInt(trimmedCode, 10)
    if (!Number.isFinite(codigoNum) || codigoNum < 10000 || codigoNum > 99999) {
      setError('El código debe ser un número de 5 dígitos.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await recoveryApi.validateRecoveryCode(email, codigoNum)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setCodigo(trimmedCode)
      setStep('password')
    } catch {
      setError('Error de red. Verifica tu conexión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const codigoNum = Number.parseInt(codigo, 10)
    setIsSubmitting(true)
    try {
      const result = await recoveryApi.resetPassword(email, codigoNum, password)
      if (!result.ok) {
        setError(result.message)
        return
      }
      const serverMsg =
        typeof result.data.message === 'string' && result.data.message.trim() !== ''
          ? result.data.message
          : 'Contraseña modificada correctamente.'
      setInfoMessage(serverMsg)
      setStep('done')
    } catch {
      setError('Error de red. Verifica tu conexión.')
    } finally {
      setIsSubmitting(false)
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
              {copy.title}
            </h2>
            <p className="forgotModal__subtitle">{copy.subtitle}</p>
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

        {step === 'email' ? (
          <form className="forgotModal__body" onSubmit={handleEmailSubmit} noValidate>
            <p className="forgotModal__hint">
              Introduzca su dirección de correo electrónico para restablecer la
              contraseña. Validaremos si está registrado en el sistema.
            </p>
            <label className="forgotModal__label" htmlFor="forgot-modal-email">
              Email
            </label>
            <input
              ref={inputRef}
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
              disabled={isSubmitting}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'forgot-modal-error' : undefined}
            />
            {error ? (
              <p id="forgot-modal-error" className="forgotModal__error" role="alert">
                {error}
              </p>
            ) : null}
            <footer className="forgotModal__footer">
              <button
                type="button"
                className="forgotModal__btn forgotModal__btn--secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="forgotModal__btn forgotModal__btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Validando…' : 'Enviar'}
              </button>
            </footer>
          </form>
        ) : null}

        {step === 'code' ? (
          <form className="forgotModal__body" onSubmit={handleCodeSubmit} noValidate>
            <p className="forgotModal__success" role="status">
              {infoMessage}
            </p>
            <p className="forgotModal__hint">
              Correo: <strong>{email}</strong>
            </p>
            <label className="forgotModal__label" id="forgot-modal-code-label">
              Código de {CODE_LENGTH} dígitos
            </label>
            <RecoveryCodeInput
              value={codigo}
              onChange={(next) => {
                setCodigo(next)
                setError(null)
              }}
              disabled={isSubmitting}
              idPrefix="forgot-modal-code"
              inputRef={codeInputRef}
            />
            {error ? (
              <p id="forgot-modal-error" className="forgotModal__error" role="alert">
                {error}
              </p>
            ) : null}
            <footer className="forgotModal__footer">
              <button
                type="button"
                className="forgotModal__btn forgotModal__btn--secondary"
                onClick={() => {
                  setError(null)
                  setCodigo('')
                  setStep('email')
                }}
                disabled={isSubmitting}
              >
                Volver
              </button>
              <button
                type="submit"
                className="forgotModal__btn forgotModal__btn--primary"
                disabled={isSubmitting || codigo.length !== CODE_LENGTH}
              >
                {isSubmitting ? 'Validando…' : 'Verificar código'}
              </button>
            </footer>
          </form>
        ) : null}

        {step === 'password' ? (
          <form className="forgotModal__body" onSubmit={handlePasswordSubmit} noValidate>
            <label className="forgotModal__label" htmlFor="forgot-modal-password">
              Nueva contraseña
            </label>
            <input
              ref={inputRef}
              id="forgot-modal-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="forgotModal__input"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value)
                setError(null)
              }}
              disabled={isSubmitting}
            />
            <label className="forgotModal__label" htmlFor="forgot-modal-confirm">
              Confirmar contraseña
            </label>
            <input
              id="forgot-modal-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="forgotModal__input"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(ev) => {
                setConfirmPassword(ev.target.value)
                setError(null)
              }}
              disabled={isSubmitting}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'forgot-modal-error' : undefined}
            />
            {error ? (
              <p id="forgot-modal-error" className="forgotModal__error" role="alert">
                {error}
              </p>
            ) : null}
            <footer className="forgotModal__footer">
              <button
                type="button"
                className="forgotModal__btn forgotModal__btn--secondary"
                onClick={() => {
                  setError(null)
                  setStep('code')
                }}
                disabled={isSubmitting}
              >
                Volver
              </button>
              <button
                type="submit"
                className="forgotModal__btn forgotModal__btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando…' : 'Restablecer'}
              </button>
            </footer>
          </form>
        ) : null}

        {step === 'done' ? (
          <div className="forgotModal__body">
            <p className="forgotModal__success" role="status">
              {infoMessage}
            </p>
            <footer className="forgotModal__footer">
              <button
                type="button"
                className="forgotModal__btn forgotModal__btn--primary"
                onClick={onClose}
              >
                Ir al login
              </button>
            </footer>
          </div>
        ) : null}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
