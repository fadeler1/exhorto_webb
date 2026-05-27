import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { USER_PERFIL } from '../../../auth/userPerfil.js'
import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import '../../exhortos/components/BoletaReceptorModal.css'
import '../../shared/proModalSkin.css'
/**
 * @param {import('../../../api/usersApi.js').UserListItem} user
 */
function userToForm(user) {
  return {
    nombre: fixLegacyEncoding(user.nombre ?? ''),
    email: user.email ?? '',
    login: user.login ?? '',
    perfil: user.perfil ?? '',
  }
}

const emptyForm = () => ({
  nombre: '',
  email: '',
  login: '',
  perfil: '',
})

/**
 * @param {{
 *   isOpen: boolean
 *   mode: 'create' | 'edit'
 *   user: import('../../../api/usersApi.js').UserListItem | null
 *   onClose: () => void
 *   isSaving?: boolean
 *   error?: string | null
 *   onSave: (payload: import('../../../api/usersApi.js').UserFormPayload) => void | Promise<void>
 * }} props
 */
export function UsuarioModal({
  isOpen,
  mode,
  user,
  onClose,
  isSaving = false,
  error = null,
  onSave,
}) {
  const titleId = useId()
  const nombreRef = useRef(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [perfil, setPerfil] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null))

  const userId = user?.id ?? null

  useEffect(() => {
    if (!isOpen) return undefined

    if (mode === 'edit' && user) {
      const form = userToForm(user)
      setNombre(form.nombre)
      setEmail(form.email)
      setLogin(form.login)
      setPerfil(form.perfil)
    } else if (mode === 'create') {
      const form = emptyForm()
      setNombre(form.nombre)
      setEmail(form.email)
      setLogin(form.login)
      setPerfil(form.perfil)
    }

    setPassword('')
    setLocalError(null)

    const t = requestAnimationFrame(() => nombreRef.current?.focus())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
    }
  }, [isOpen, mode, userId, user])

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

    const nombreTrim = nombre.trim()
    const emailTrim = email.trim()
    const loginTrim = login.trim().toLowerCase()

    if (!nombreTrim) {
      setLocalError('Ingresa el nombre del usuario.')
      return
    }
    if (!emailTrim) {
      setLocalError('Ingresa el email.')
      return
    }
    if (!loginTrim) {
      setLocalError('Ingresa el login.')
      return
    }
    if (!perfil) {
      setLocalError('Selecciona un perfil.')
      return
    }
    if (mode === 'create' && password.trim().length < 4) {
      setLocalError('Ingresa una contraseña de al menos 4 caracteres.')
      return
    }
    if (
      password.trim().length > 0 &&
      password.trim().length < 4
    ) {
      setLocalError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    /** @type {import('../../../api/usersApi.js').UserFormPayload} */
    const payload = {
      nombre: nombreTrim,
      email: emailTrim,
      login: loginTrim,
      perfil,
    }
    if (password.trim()) {
      payload.password = password.trim()
    }

    await onSave(payload)
  }

  if (!isOpen) return null
  if (mode === 'edit' && !user) return null

  const displayError = localError || error
  const title = mode === 'create' ? 'NUEVO USUARIO' : 'MODIFICAR USUARIO'

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
            {title}
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
          <label className="boletaModal__field" htmlFor="usr-nombre">
            <span className="boletaModal__label">Nombre</span>
            <input
              ref={nombreRef}
              id="usr-nombre"
              type="text"
              className="boletaModal__input"
              value={nombre}
              onChange={(ev) => {
                setNombre(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          <label className="boletaModal__field" htmlFor="usr-email">
            <span className="boletaModal__label">Email</span>
            <input
              id="usr-email"
              type="email"
              className="boletaModal__input"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            />
          </label>

          <label className="boletaModal__field" htmlFor="usr-perfil">
            <span className="boletaModal__label">Perfil</span>
            <select
              id="usr-perfil"
              className="boletaModal__input"
              value={perfil}
              onChange={(ev) => {
                setPerfil(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
            >
              <option value="">Seleccione un perfil</option>
              <option value={USER_PERFIL.TODO}>1.- Administrador</option>
              <option value={USER_PERFIL.INGRESAR}>2.- Ingresador exhorto</option>
            </select>
          </label>

          <label className="boletaModal__field" htmlFor="usr-login">
            <span className="boletaModal__label">Login</span>
            <input
              id="usr-login"
              type="text"
              className="boletaModal__input"
              value={login}
              onChange={(ev) => {
                setLogin(ev.target.value)
                setLocalError(null)
              }}
              disabled={isSaving}
              autoComplete="username"
            />
          </label>

          {mode === 'create' ? (
            <label className="boletaModal__field" htmlFor="usr-password">
              <span className="boletaModal__label">Contraseña</span>
              <input
                id="usr-password"
                type="password"
                className="boletaModal__input"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value)
                  setLocalError(null)
                }}
                disabled={isSaving}
                autoComplete="new-password"
              />
            </label>
          ) : null}

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
              {isSaving
                ? 'Guardando…'
                : mode === 'create'
                  ? 'Guardar usuario'
                  : 'Modificar usuario'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
