import { useCallback, useState } from 'react'

const emptyForm = () => ({
  username: '',
  password: '',
})

/**
 * Caso de uso de login en la UI: validación básica, estado y delegación al servicio.
 * No conoce detalles de HTTP (SRP).
 * @param {{
 *   authService: { login: (c: { username: string, password: string }) => Promise<{ success: boolean, token?: string, user?: Record<string, unknown>, message?: string }> }
 *   tokenStorage: { setToken: (t: string) => void }
 *   userStorage?: { setUser: (u: Record<string, unknown>) => void }
 *   onAuthenticated?: () => void
 * }} opts
 */
export function useLogin({ authService, tokenStorage, userStorage, onAuthenticated }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }, [])

  const submit = useCallback(
    async (event) => {
      event.preventDefault()
      setError(null)
      const username = form.username.trim()
      const { password } = form
      if (!username || !password) {
        setError('Ingresa usuario y contraseña.')
        return
      }

      setIsSubmitting(true)
      try {
        const result = await authService.login({ username, password })
        if (result.success) {
          tokenStorage.setToken(result.token)
          if (userStorage && result.user) {
            userStorage.setUser(result.user)
          }
          onAuthenticated?.()
        } else {
          setError(result.message ?? 'No se pudo iniciar sesión.')
        }
      } catch {
        setError('Ocurrió un error inesperado. Intenta de nuevo.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [authService, form, onAuthenticated, tokenStorage],
  )

  return {
    username: form.username,
    password: form.password,
    error,
    isSubmitting,
    setField,
    submit,
  }
}
