/** @typedef {{ getToken: () => string | null, setToken: (token: string) => void, clear: () => void }} SessionTokenStorage */

/**
 * Persistencia del token de sesión (una sola responsabilidad: almacenamiento).
 * @param {string} [storageKey]
 * @returns {SessionTokenStorage}
 */
export function createSessionTokenStorage(
  storageKey = 'exhortos_session_token',
) {
  return {
    getToken: () => sessionStorage.getItem(storageKey),
    setToken: (token) => sessionStorage.setItem(storageKey, token),
    clear: () => sessionStorage.removeItem(storageKey),
  }
}
