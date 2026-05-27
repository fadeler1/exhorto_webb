import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createExhorto, parseExhortoDetail } from '../../api/exhortosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { AppShell } from '../layout/AppShell.jsx'
import './IngresarExhortoPage.css'

const emptyForm = () => ({
  apellidoDeudor: '',
  nombreCliente: '',
  tribunalOrigen: '',
  rolJuicio: '',
  ciudad: '',
  facultades: '',
  abogado: '',
})

export function IngresarExhortoPage() {
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [success, setSuccess] = useState(/** @type {string | null} */ (null))
  const [isSaving, setIsSaving] = useState(false)

  /**
   * @param {keyof ReturnType<typeof emptyForm>} name
   * @param {string} value
   */
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const apellidoDeudor = form.apellidoDeudor.trim()
    const nombreCliente = form.nombreCliente.trim()
    const tribunalOrigen = form.tribunalOrigen.trim()
    const rolJuicio = form.rolJuicio.trim()
    const ciudad = form.ciudad.trim()
    const abogado = form.abogado.trim()

    if (!apellidoDeudor || !nombreCliente || !tribunalOrigen || !rolJuicio || !ciudad || !abogado) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    setIsSaving(true)
    try {
      const result = await createExhorto(apiClient, {
        apellidoDeudor,
        nombreCliente,
        tribunalOrigen,
        rolJuicio,
        ciudad,
        abogado,
        facultades: form.facultades.trim() || undefined,
      })

      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(result.message)
        return
      }

      const created = parseExhortoDetail(result.data)
      if (created?.id) {
        navigate(`/exhortos/${created.id}/diligencias`, { replace: true })
        return
      }

      setSuccess('Exhorto guardado correctamente.')
      setForm(emptyForm())
    } catch {
      setError('No se pudo guardar el exhorto. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppShell activeNav="ingresar">
      <div className="dashMain__inner ingresarExhorto__inner">
        <h1 className="ingresarExhorto__title">Ingreso de nuevo exhorto</h1>

        <form className="ingresarExhorto__panel" onSubmit={handleGuardar} noValidate>
          <h2 className="ingresarExhorto__panelTitle">Ingresar exhorto</h2>

          {error ? (
            <p className="ingresarExhorto__feedback ingresarExhorto__feedback--error" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="ingresarExhorto__feedback ingresarExhorto__feedback--ok" role="status">
              {success}
            </p>
          ) : null}

          <div className="ingresarExhorto__grid">
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Apellido deudor</span>
              <input
                className="ingresarExhorto__input"
                value={form.apellidoDeudor}
                onChange={(e) => setField('apellidoDeudor', e.target.value)}
                required
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Nombre cliente</span>
              <input
                className="ingresarExhorto__input"
                value={form.nombreCliente}
                onChange={(e) => setField('nombreCliente', e.target.value)}
                required
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Tribunal origen</span>
              <input
                className="ingresarExhorto__input"
                value={form.tribunalOrigen}
                onChange={(e) => setField('tribunalOrigen', e.target.value)}
                required
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Rol juicio</span>
              <input
                className="ingresarExhorto__input"
                value={form.rolJuicio}
                onChange={(e) => setField('rolJuicio', e.target.value)}
                required
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Ciudad</span>
              <input
                className="ingresarExhorto__input"
                value={form.ciudad}
                onChange={(e) => setField('ciudad', e.target.value)}
                required
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Facultades</span>
              <input
                className="ingresarExhorto__input"
                value={form.facultades}
                onChange={(e) => setField('facultades', e.target.value)}
              />
            </label>
            <label className="ingresarExhorto__field">
              <span className="ingresarExhorto__label">Abogado</span>
              <input
                className="ingresarExhorto__input"
                value={form.abogado}
                onChange={(e) => setField('abogado', e.target.value)}
                required
              />
            </label>
          </div>

          <hr className="ingresarExhorto__divider" />

          <div className="ingresarExhorto__actions">
            <button type="submit" className="ingresarExhorto__save" disabled={isSaving}>
              {isSaving ? 'GUARDANDO…' : 'GUARDAR'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
