import { Navigate } from 'react-router-dom'
import { useUserPerfil } from '../auth/hooks/useUserPerfil.js'
import { getDefaultRouteForPerfil } from '../navigation/appNav.js'

/**
 * Solo usuarios con perfil INGRESAR o TODO pueden crear exhortos.
 * @param {{ children: import('react').ReactNode }} props
 */
export function RequireCanIngresarExhorto({ children }) {
  const { canIngresarExhorto, perfil } = useUserPerfil()

  if (!canIngresarExhorto) {
    return <Navigate to={getDefaultRouteForPerfil(perfil)} replace />
  }

  return children
}
