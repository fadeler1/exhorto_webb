import { createApiClient } from '../api/apiClient.js'
import { createHttpAuthService } from './infrastructure/httpAuthService.js'
import { createSessionTokenStorage } from './infrastructure/sessionTokenStorage.js'
import { createSessionUserStorage } from './infrastructure/sessionUserStorage.js'

export const SESSION_TOKEN_STORAGE_KEY = 'exhortos_session_token'
export const SESSION_USER_STORAGE_KEY = 'exhortos_session_user'

/**
 * Composition root del módulo de auth (DIP: pantallas piden estas implementaciones por contexto).
 * @returns {{
 *   tokenStorage: ReturnType<typeof createSessionTokenStorage>
 *   userStorage: ReturnType<typeof createSessionUserStorage>
 *   authService: ReturnType<typeof createHttpAuthService>
 *   apiClient: ReturnType<typeof createApiClient>
 *   clearSession: () => void
 * }}
 */
export function createDefaultAuthDependencies() {
  const tokenStorage = createSessionTokenStorage(SESSION_TOKEN_STORAGE_KEY)
  const userStorage = createSessionUserStorage(SESSION_USER_STORAGE_KEY)
  const authService = createHttpAuthService()
  const apiClient = createApiClient({
    getToken: () => tokenStorage.getToken(),
  })

  function clearSession() {
    tokenStorage.clear()
    userStorage.clear()
  }

  return {
    tokenStorage,
    userStorage,
    authService,
    apiClient,
    clearSession,
  }
}
