import { Navigate, useLocation } from 'react-router-dom'
import { useAuthDependencies } from '../auth/AuthDependenciesProvider.jsx'

/**
 * Guard de ruta que depende solo del contrato TokenStorage (fácil de testear mockando el proveedor).
 * @param {{ children: import('react').ReactNode }} props
 */
export function RequireAuth({ children }) {
  const location = useLocation()
  const { tokenStorage } = useAuthDependencies()
  const token = tokenStorage.getToken()

  if (!token) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }

  return children
}
