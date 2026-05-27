import { useMemo } from 'react'
import { decodeJwtPayload } from '../decodeJwtPayload.js'
import { useAuthDependencies } from '../AuthDependenciesProvider.jsx'
import {
  canAdministrarUsuarios,
  canBuscarExhortos,
  canIngresarExhorto,
  canVerHomeDashboard,
  canVerHonorarios,
  USER_PERFIL,
} from '../userPerfil.js'

/**
 * Perfil de sesión (storage + JWT) y flags de permisos.
 */
export function useUserPerfil() {
  const { tokenStorage, userStorage } = useAuthDependencies()
  const token = tokenStorage.getToken()
  const sessionUser = userStorage.getUser()

  return useMemo(() => {
    const claims = decodeJwtPayload(token)
    const fromSession = sessionUser?.perfil
    const fromClaims = claims?.perfil
    const perfil =
      typeof fromSession === 'string' && fromSession.trim()
        ? fromSession.trim()
        : typeof fromClaims === 'string' && fromClaims.trim()
          ? fromClaims.trim()
          : ''

    return {
      perfil,
      isTodo: perfil === USER_PERFIL.TODO,
      isIngresar: perfil === USER_PERFIL.INGRESAR,
      canIngresarExhorto: canIngresarExhorto(perfil),
      canAdministrarUsuarios: canAdministrarUsuarios(perfil),
      canVerHomeDashboard: canVerHomeDashboard(perfil),
      canVerHonorarios: canVerHonorarios(perfil),
      canBuscarExhortos: canBuscarExhortos(perfil),
    }
  }, [token, sessionUser])
}
