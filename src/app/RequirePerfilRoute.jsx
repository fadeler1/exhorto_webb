import { Navigate, useLocation } from 'react-router-dom'
import { useUserPerfil } from '../auth/hooks/useUserPerfil.js'
import { getDefaultRouteForPerfil, isPathAllowedForPerfil } from '../navigation/appNav.js'

/**
 * Bloquea rutas que no correspondan al menú del perfil actual.
 * @param {{ children: import('react').ReactNode }} props
 */
export function RequirePerfilRoute({ children }) {
  const location = useLocation()
  const { perfil } = useUserPerfil()

  if (!isPathAllowedForPerfil(perfil, location.pathname)) {
    return <Navigate to={getDefaultRouteForPerfil(perfil)} replace />
  }

  return children
}
