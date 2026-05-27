import { createContext, useContext, useMemo } from 'react'
import { createDefaultAuthDependencies } from './defaultAuthDeps.js'

const AuthDependenciesContext = createContext(null)

/**
 * Provee las dependencias de autenticación a la SPA (singleton por montaje).
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthDependenciesProvider({ children }) {
  const deps = useMemo(() => createDefaultAuthDependencies(), [])
  return (
    <AuthDependenciesContext.Provider value={deps}>
      {children}
    </AuthDependenciesContext.Provider>
  )
}

/**
 * @returns {ReturnType<typeof createDefaultAuthDependencies>}
 */
export function useAuthDependencies() {
  const ctx = useContext(AuthDependenciesContext)
  if (!ctx) {
    throw new Error(
      'useAuthDependencies debe usarse dentro de AuthDependenciesProvider',
    )
  }
  return ctx
}
