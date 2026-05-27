/** @typedef {{ username?: string, nombre?: string, perfil?: string, mustChangePassword?: boolean }} SessionUser */

/**
 * @param {string} [storageKey]
 */
export function createSessionUserStorage(storageKey = 'exhortos_session_user') {
  return {
    /** @returns {SessionUser | null} */
    getUser() {
      const raw = sessionStorage.getItem(storageKey)
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === 'object'
          ? /** @type {SessionUser} */ (parsed)
          : null
      } catch {
        return null
      }
    },
    /** @param {SessionUser} user */
    setUser(user) {
      sessionStorage.setItem(storageKey, JSON.stringify(user))
    },
    clear() {
      sessionStorage.removeItem(storageKey)
    },
  }
}
