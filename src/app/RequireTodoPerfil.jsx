import { Navigate } from 'react-router-dom'
import { useUserPerfil } from '../auth/hooks/useUserPerfil.js'
import { getDefaultRouteForPerfil } from '../navigation/appNav.js'

/**
 * Rutas reservadas al perfil TODO (home analítico, honorarios, admin).
 * @param {{ children: import('react').ReactNode }} props
 */
export function RequireTodoPerfil({ children }) {
  const { perfil, isTodo } = useUserPerfil()

  if (!isTodo) {
    return <Navigate to={getDefaultRouteForPerfil(perfil)} replace />
  }

  return children
}
