import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeJwtPayload } from '../../auth/decodeJwtPayload.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { useUserPerfil } from '../../auth/hooks/useUserPerfil.js'
import { getAppNavItems } from '../../navigation/appNav.js'
import { AppNavMenu } from './AppNavMenu.jsx'
import '../dashboard/DashboardPage.css'

function LogoMark() {
  return (
    <div className="dashBrand__mark" aria-hidden>
      <div className="dashBrand__markInner">
        <svg viewBox="0 0 48 48" className="dashBrand__scales">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M24 12v26M15 21h18M15 21l-3.5 9h7M33 21l3.5 9h-7"
          />
          <circle cx="15" cy="33" r="2.5" fill="currentColor" />
          <circle cx="33" cy="33" r="2.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}

/**
 * @param {{
 *   children: import('react').ReactNode
 *   activeNav?: string
 * }} props
 */
export function AppShell({ children, activeNav = 'exhorto' }) {
  const navigate = useNavigate()
  const { tokenStorage, userStorage, clearSession } = useAuthDependencies()
  const { perfil } = useUserPerfil()
  const [navOpen, setNavOpen] = useState(false)

  const navItems = useMemo(() => getAppNavItems(perfil), [perfil])

  const token = tokenStorage.getToken()
  const sessionUser = userStorage.getUser()
  const claims = useMemo(() => decodeJwtPayload(token), [token])
  const userDisplay = useMemo(() => {
    const fromSession = sessionUser?.nombre ?? sessionUser?.username
    if (typeof fromSession === 'string' && fromSession.trim()) return fromSession.trim()
    const n = claims?.nombre
    const login = claims?.login
    if (typeof n === 'string' && n.trim()) return n.trim()
    if (typeof login === 'string' && login.trim()) return login.trim()
    return 'Usuario'
  }, [claims, sessionUser])

  const closeNav = useCallback(() => setNavOpen(false), [])

  useEffect(() => {
    if (!navOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className={`dashApp${navOpen ? ' dashApp--navOpen' : ''}`}>
      <button
        type="button"
        className="dashApp__overlay"
        aria-label="Cerrar menú"
        tabIndex={navOpen ? 0 : -1}
        onClick={closeNav}
      />

      <aside className="dashApp__sidebar" id="dash-sidebar" aria-label="Menú principal">
        <div className="dashBrand">
          <LogoMark />
          <p className="dashBrand__text">
            Tramitación Exhortos
            <span className="dashBrand__sub">A &amp; G Asociados</span>
          </p>
        </div>
        <nav className="dashNav" aria-label="Secciones">
          <AppNavMenu items={navItems} activeNav={activeNav} onNavigate={closeNav} />
        </nav>
      </aside>

      <div className="dashApp__column">
        <header className="dashTop">
          <div className="dashTop__left">
            <button
              type="button"
              className="dashTop__menu"
              aria-expanded={navOpen}
              aria-controls="dash-sidebar"
              onClick={() => setNavOpen((o) => !o)}
            >
              <span className="dashTop__menuBar" />
              <span className="dashTop__menuBar" />
              <span className="dashTop__menuBar" />
            </button>
            <h1 className="dashTop__title">TRAMITACIÓN EXHORTOS A &amp; G ASOCIADOS</h1>
          </div>
          <div className="dashTop__right">
            <div className="dashTop__userChip" title={`Sesión: ${userDisplay}`}>
              <span className="dashTop__userChip-label">Usuario</span>
              <span className="dashTop__userChip-name">{userDisplay}</span>
            </div>
            <button type="button" className="dashTop__logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="dashMain">{children}</main>
      </div>
    </div>
  )
}
