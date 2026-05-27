import { LockIcon } from './LockIcon.jsx'

/**
 * Formulario presentacional: sin fetch ni reglas de negocio (ISP: solo props explícitas).
 * @param {{
 *   username: string
 *   password: string
 *   error: string | null
 *   isSubmitting: boolean
 *   onFieldChange: (field: 'username' | 'password', value: string) => void
 *   onSubmit: (e: import('react').FormEvent) => void
 *   onOpenForgotPassword?: () => void
 * }} props
 */
export function LoginForm({
  username,
  password,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
  onOpenForgotPassword,
}) {
  const usernameId = 'login-username'
  const passwordId = 'login-password'

  return (
    <form className="loginPanel__form" onSubmit={onSubmit} noValidate>
      <div className="loginPanel__field">
        <label className="loginPanel__label" htmlFor={usernameId}>
          Usuario
        </label>
        <div className="loginPanel__inputWrap">
          <span className="loginPanel__inputIcon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id={usernameId}
            name="username"
            autoComplete="username"
            type="text"
            className="loginPanel__input loginPanel__input--withIcon"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => onFieldChange('username', e.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
          />
        </div>
      </div>
      <div className="loginPanel__field">
        <label className="loginPanel__label" htmlFor={passwordId}>
          Contraseña
        </label>
        <div className="loginPanel__inputWrap">
          <span className="loginPanel__inputIcon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            id={passwordId}
            name="password"
            autoComplete="current-password"
            type="password"
            className="loginPanel__input loginPanel__input--withIcon"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onFieldChange('password', e.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
          />
        </div>
      </div>

      <div className="loginPanel__row loginPanel__row--end">
        {onOpenForgotPassword ? (
          <button
            type="button"
            className="loginPanel__link loginPanel__linkButton"
            onClick={onOpenForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>
        ) : null}
      </div>

      {error ? (
        <p id="login-error" className="loginPanel__error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="loginPanel__submit"
        disabled={isSubmitting}
      >
        <LockIcon className="loginPanel__submitIcon" />
        <span>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</span>
      </button>
    </form>
  )
}
