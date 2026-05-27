import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { getDefaultRouteForPerfil } from '../../navigation/appNav.js'
import { useLogin } from '../../auth/hooks/useLogin.js'
import { ForgotPasswordModal } from './components/ForgotPasswordModal.jsx'
import { LoginForm } from './components/LoginForm.jsx'
import './LoginPage.css'

/**
 * Pantalla de acceso: compone el layout legado (cabecera naranja + panel) y el caso de uso useLogin.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const { authService, tokenStorage, userStorage } = useAuthDependencies()
  const [forgotOpen, setForgotOpen] = useState(false)

  const sessionUser = userStorage.getUser()
  const existing = tokenStorage.getToken()
  if (existing) {
    return <Navigate to={getDefaultRouteForPerfil(sessionUser?.perfil)} replace />
  }

  const {
    username,
    password,
    error,
    isSubmitting,
    setField,
    submit,
  } = useLogin({
    authService,
    tokenStorage,
    userStorage,
    onAuthenticated: () => {
      const user = userStorage.getUser()
      navigate(getDefaultRouteForPerfil(user?.perfil), { replace: true })
    },
  })

  return (
    <div className="loginScreen" aria-hidden={false}>
      <div className="loginScreen__ambient" aria-hidden="true" />
      <div className="loginScreen__photoLayer" aria-hidden="true">
        <div className="loginScreen__photoLayer-inner" />
      </div>
      <div className="loginScreen__backdrop" aria-hidden="true">
        <div className="loginScreen__fakeSidebar" />
        <div className="loginScreen__fakeMain">
          <div className="loginScreen__fakeTopbar" />
          <div className="loginScreen__fakeGrid">
            <div className="loginScreen__fakeCard" />
            <div className="loginScreen__fakeCard loginScreen__fakeCard--wide" />
            <div className="loginScreen__fakeCard" />
          </div>
        </div>
      </div>

      <div className="loginScreen__overlay" />

      <main className="loginScreen__center">
        <section className="loginPanel" aria-labelledby="login-title">
          <header className="loginPanel__header">
            <div className="loginPanel__logoWrap">
              <img
                className="loginPanel__logo"
                src="/logo-tramitacion-exhortos.png"
                width="72"
                height="72"
                alt=""
                decoding="async"
              />
            </div>
            <p className="loginPanel__eyebrow">A &amp; G Asociados</p>
            <h1 id="login-title" className="loginPanel__title">
              Tramitación de exhortos
            </h1>
            <p className="loginPanel__subtitle">
              Ingresa con tu usuario corporativo para continuar
            </p>
          </header>
          <div className="loginPanel__body">
            <LoginForm
              username={username}
              password={password}
              error={error}
              isSubmitting={isSubmitting}
              onFieldChange={setField}
              onSubmit={submit}
              onOpenForgotPassword={() => setForgotOpen(true)}
            />
          </div>
        </section>
        <p className="loginScreen__footerNote">
          Conexión segura · Solo personal autorizado
        </p>
      </main>

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  )
}
