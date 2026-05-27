import { Navigate } from 'react-router-dom'
import { useUserPerfil } from '../auth/hooks/useUserPerfil.js'
import { getDefaultRouteForPerfil } from '../navigation/appNav.js'

/** Redirige a la ruta inicial según el perfil del usuario. */
export function PerfilDefaultRedirect() {
  const { perfil } = useUserPerfil()
  return <Navigate to={getDefaultRouteForPerfil(perfil)} replace />
}
