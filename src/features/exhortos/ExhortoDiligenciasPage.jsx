import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDiligenciaTipos } from '../../api/catalogApi.js'
import {
  addBoletaReceptor,
  addDiligencia,
  fetchExhortoById,
  parseExhortoDetail,
  removeBoletaReceptor,
  removeDiligencia,
  updateBoletaReceptor,
  updateExhorto,
} from '../../api/exhortosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'
import { formatLegacyDate } from '../../utils/formatLegacyDate.js'
import { mergeExhortoUpdateInDashboardSession } from '../dashboard/dashboardSearchSession.js'
import { AppShell } from '../layout/AppShell.jsx'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { BoletaReceptorModal } from './components/BoletaReceptorModal.jsx'
import { ExhortoDatosModal } from './components/ExhortoDatosModal.jsx'
import './ExhortoDiligenciasPage.css'

/**
 * @param {string | null | undefined} value
 */
function display(value) {
  return fixLegacyEncoding((value ?? '').trim())
}

function todayInputValue() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @param {import('../../api/exhortosApi.js').DiligenciaItem} item
 */
function diligenciaId(item) {
  const raw = item.id ?? /** @type {{ _id?: string }} */ (item)._id
  return typeof raw === 'string' ? raw : ''
}

/**
 * @param {import('../../api/catalogApi.js').DiligenciaTipo[]} items
 */
function sortTipos(items) {
  return [...items].sort((a, b) => {
    const oa = typeof a.orden === 'number' ? a.orden : Number.parseInt(a.codigo, 10)
    const ob = typeof b.orden === 'number' ? b.orden : Number.parseInt(b.codigo, 10)
    if (!Number.isNaN(oa) && !Number.isNaN(ob) && oa !== ob) return oa - ob
    return a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  })
}

export function ExhortoDiligenciasPage() {
  const { exhortoId } = useParams()
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()

  const [exhorto, setExhorto] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoDetail | null} */ (null),
  )
  const [tipos, setTipos] = useState(
    /** @type {import('../../api/catalogApi.js').DiligenciaTipo[]} */ ([]),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(/** @type {string | null} */ (null))
  const [formError, setFormError] = useState(/** @type {string | null} */ (null))
  const [formOk, setFormOk] = useState(/** @type {string | null} */ (null))
  const [isSaving, setIsSaving] = useState(false)

  const [codigo, setCodigo] = useState('')
  const [fecha, setFecha] = useState(todayInputValue)
  const [observaciones, setObservaciones] = useState('')
  const [datosModalOpen, setDatosModalOpen] = useState(false)
  const [datosModalError, setDatosModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingDatos, setIsSavingDatos] = useState(false)
  const [boletaModalOpen, setBoletaModalOpen] = useState(false)
  const [editBoleta, setEditBoleta] = useState(
    /** @type {import('../../api/exhortosApi.js').BoletaReceptorItem | null} */ (null),
  )
  const [boletaModalError, setBoletaModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingBoleta, setIsSavingBoleta] = useState(false)
  const [deleteRequest, setDeleteRequest] = useState(
    /** @type {null | { kind: 'diligencia', item: import('../../api/exhortosApi.js').DiligenciaItem } | { kind: 'boleta', item: import('../../api/exhortosApi.js').BoletaReceptorItem }} */ (null),
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const tiposActivos = useMemo(
    () => sortTipos(tipos.filter((t) => t.activo !== false)),
    [tipos],
  )

  const loadData = useCallback(async () => {
    if (!exhortoId) {
      setLoadError('Exhorto no indicado.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setLoadError(null)
    try {
      const [exhortoRes, tiposRes] = await Promise.all([
        fetchExhortoById(apiClient, exhortoId),
        fetchDiligenciaTipos(apiClient),
      ])

      if (!exhortoRes.ok) {
        if (exhortoRes.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setLoadError(exhortoRes.message)
        setExhorto(null)
        return
      }

      const detail = parseExhortoDetail(exhortoRes.data)
      if (!detail) {
        setLoadError('No se encontró el exhorto.')
        setExhorto(null)
        return
      }
      setExhorto(detail)

      if (tiposRes.ok) {
        setTipos(tiposRes.items)
      }
    } catch {
      setLoadError('No se pudo cargar el exhorto. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [apiClient, clearSession, exhortoId, navigate])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleAgregar(e) {
    e.preventDefault()
    setFormError(null)
    setFormOk(null)

    if (!exhortoId || !codigo) {
      setFormError('Selecciona una diligencia.')
      return
    }
    if (!fecha) {
      setFormError('Indica la fecha.')
      return
    }

    setIsSaving(true)
    try {
      const result = await addDiligencia(apiClient, exhortoId, {
        codigo,
        fecha,
        observaciones: observaciones.trim() || undefined,
      })
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setFormError(result.message)
        return
      }

      const updated = parseExhortoDetail(result.data)
      if (updated) {
        setExhorto(updated)
      } else {
        await loadData()
      }

      setObservaciones('')
      setFormOk('Diligencia agregada.')
    } catch {
      setFormError('No se pudo agregar la diligencia.')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * @param {import('../../api/exhortosApi.js').DiligenciaItem} item
   */
  async function handleEliminar(item) {
    const id = diligenciaId(item)
    if (!exhortoId || !id) return
    setDeleteRequest({ kind: 'diligencia', item })
  }

  /**
   * @param {import('../../api/exhortosApi.js').DiligenciaItem} item
   */
  async function deleteDiligencia(item) {
    const id = diligenciaId(item)
    if (!exhortoId || !id) return
    setFormError(null)
    setFormOk(null)
    try {
      const result = await removeDiligencia(apiClient, exhortoId, id)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setFormError(result.message)
        return
      }
      const updated = parseExhortoDetail(result.data)
      if (updated) {
        setExhorto(updated)
      } else {
        setExhorto((prev) =>
          prev
            ? {
                ...prev,
                diligencias: prev.diligencias.filter((d) => diligenciaId(d) !== id),
              }
            : prev,
        )
      }
      setFormOk('Diligencia eliminada.')
    } catch {
      setFormError('No se pudo eliminar la diligencia.')
    }
  }

  const diligencias = exhorto?.diligencias ?? []
  const boletasReceptor = exhorto?.boletasReceptor ?? []

  function handleOpenBoletaModal() {
    setFormError(null)
    setBoletaModalError(null)
    setEditBoleta(null)
    setBoletaModalOpen(true)
  }

  /**
   * @param {import('../../api/exhortosApi.js').BoletaReceptorItem} boleta
   */
  function handleCloseDatosModal() {
    if (isSavingDatos) return
    setDatosModalOpen(false)
    setDatosModalError(null)
  }

  /**
   * @param {import('../../api/exhortosApi.js').UpdateExhortoBody} payload
   */
  async function handleGuardarDatos(payload) {
    if (!exhortoId) return
    setDatosModalError(null)
    setIsSavingDatos(true)
    try {
      const result = await updateExhorto(apiClient, exhortoId, payload)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setDatosModalError(result.message)
        return
      }
      const updated = parseExhortoDetail(result.data)
      if (updated) {
        setExhorto(updated)
        mergeExhortoUpdateInDashboardSession(updated)
      } else {
        await loadData()
      }
      setDatosModalOpen(false)
      setFormOk('Datos del exhorto actualizados.')
    } catch {
      setDatosModalError('No se pudo modificar el exhorto.')
    } finally {
      setIsSavingDatos(false)
    }
  }

  function handleEditarBoleta(boleta) {
    setFormError(null)
    setBoletaModalError(null)
    setEditBoleta(boleta)
    setBoletaModalOpen(true)
  }

  function handleCloseBoletaModal() {
    if (isSavingBoleta) return
    setBoletaModalOpen(false)
    setEditBoleta(null)
  }

  /**
   * @param {{
   *   documento: number
   *   receptor: string
   *   diligenciaEtiquetaLegacy?: string
   *   monto: number
   * }} payload
   */
  async function handleGuardarBoleta(payload) {
    if (!exhortoId) return
    const boletaEnEdicion = editBoleta
    setBoletaModalError(null)
    setIsSavingBoleta(true)
    try {
      const body = {
        documento: payload.documento,
        receptor: payload.receptor,
        monto: payload.monto,
        diligenciaEtiquetaLegacy: payload.diligenciaEtiquetaLegacy,
      }
      const result = boletaEnEdicion?.id
        ? await updateBoletaReceptor(apiClient, exhortoId, boletaEnEdicion.id, body)
        : await addBoletaReceptor(apiClient, exhortoId, body)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setBoletaModalError(result.message)
        return
      }
      const updated = parseExhortoDetail(result.data)
      if (updated) {
        setExhorto(updated)
      } else {
        await loadData()
      }
      setBoletaModalOpen(false)
      setEditBoleta(null)
      setFormOk(boletaEnEdicion ? 'Boleta receptor modificada.' : 'Boleta receptor guardada.')
    } catch {
      setBoletaModalError(
        boletaEnEdicion
          ? 'No se pudo modificar la boleta receptor.'
          : 'No se pudo guardar la boleta receptor.',
      )
    } finally {
      setIsSavingBoleta(false)
    }
  }

  /**
   * @param {import('../../api/exhortosApi.js').BoletaReceptorItem} boleta
   */
  async function handleEliminarBoleta(boleta) {
    if (!exhortoId || !boleta.id) return
    setDeleteRequest({ kind: 'boleta', item: boleta })
  }

  /**
   * @param {import('../../api/exhortosApi.js').BoletaReceptorItem} boleta
   */
  async function deleteBoletaReceptor(boleta) {
    if (!exhortoId || !boleta.id) return
    setFormError(null)
    setFormOk(null)
    try {
      const result = await removeBoletaReceptor(apiClient, exhortoId, boleta.id)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setFormError(result.message)
        return
      }
      const updated = parseExhortoDetail(result.data)
      if (updated) {
        setExhorto(updated)
      } else {
        setExhorto((prev) =>
          prev
            ? {
                ...prev,
                boletasReceptor: prev.boletasReceptor.filter((b) => b.id !== boleta.id),
              }
            : prev,
        )
      }
      setFormOk('Boleta receptor eliminada.')
    } catch {
      setFormError('No se pudo eliminar la boleta receptor.')
    }
  }

  function handleCancelDelete() {
    if (isDeleting) return
    setDeleteRequest(null)
  }

  async function handleConfirmDelete() {
    if (!deleteRequest) return
    setIsDeleting(true)
    try {
      if (deleteRequest.kind === 'diligencia') {
        await deleteDiligencia(deleteRequest.item)
      } else {
        await deleteBoletaReceptor(deleteRequest.item)
      }
      setDeleteRequest(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteDialog =
    deleteRequest?.kind === 'diligencia'
      ? {
          title: 'Eliminar diligencia',
          message: 'Esta acción eliminará la diligencia seleccionada del exhorto.',
          detail: `${display(deleteRequest.item.etiquetaLegacy || deleteRequest.item.etiqueta) || 'Diligencia'}${
            deleteRequest.item.fecha
              ? ` · ${formatLegacyDate(deleteRequest.item.fecha)}`
              : ''
          }`,
        }
      : deleteRequest?.kind === 'boleta'
        ? {
            title: 'Eliminar boleta receptor',
            message: 'Esta acción eliminará la boleta receptor seleccionada.',
            detail: `Boleta ${deleteRequest.item.documento} · ${display(
              deleteRequest.item.receptor,
            )} · $${deleteRequest.item.monto.toLocaleString('es-CL')}`,
          }
        : null

  return (
    <AppShell activeNav="exhorto">
      <div className="dashMain__inner diligPage__inner">
        <p className="diligPage__crumb">Ingresar diligencia</p>

        {isLoading ? (
          <p className="diligPage__loading" role="status">
            Cargando exhorto…
          </p>
        ) : null}

        {!isLoading && loadError ? (
          <div className="diligPage__error" role="alert">
            <p>{loadError}</p>
            <button
              type="button"
              className="diligPage__back"
              onClick={() => navigate('/home')}
            >
              Volver al listado
            </button>
          </div>
        ) : null}

        {!isLoading && !loadError && exhorto ? (
          <>
            <section className="diligReadonly" aria-label="Datos del exhorto">
              <div className="diligReadonly__toolbar">
                <h2 className="diligReadonly__title">Datos del exhorto</h2>
                <button
                  type="button"
                  className="diligReadonly__edit"
                  onClick={() => {
                    setDatosModalError(null)
                    setDatosModalOpen(true)
                  }}
                >
                  Modificar datos
                </button>
              </div>
              <div className="diligReadonly__field">
                <span className="diligReadonly__label">Apellido</span>
                <input
                  className="diligReadonly__input"
                  readOnly
                  value={display(exhorto.apellidoDeudor)}
                />
              </div>
              <div className="diligReadonly__field">
                <span className="diligReadonly__label">Nombre</span>
                <input
                  className="diligReadonly__input"
                  readOnly
                  value={display(exhorto.nombreCliente)}
                />
              </div>
              <div className="diligReadonly__field">
                <span className="diligReadonly__label">Tribunal</span>
                <input
                  className="diligReadonly__input"
                  readOnly
                  value={display(exhorto.tribunalOrigen)}
                />
              </div>
              <div className="diligReadonly__field">
                <span className="diligReadonly__label">Ciudad</span>
                <input
                  className="diligReadonly__input"
                  readOnly
                  value={display(exhorto.ciudad)}
                />
              </div>
              <div className="diligReadonly__field">
                <span className="diligReadonly__label">Rol</span>
                <input
                  className="diligReadonly__input"
                  readOnly
                  value={display(exhorto.rolJuicio)}
                />
              </div>
            </section>

            <form className="diligForm" onSubmit={handleAgregar}>
              {formError ? (
                <p className="diligForm__feedback diligForm__feedback--error" role="alert">
                  {formError}
                </p>
              ) : null}
              {formOk ? (
                <p className="diligForm__feedback diligForm__feedback--ok" role="status">
                  {formOk}
                </p>
              ) : null}

              <div className="diligForm__row">
                <label className="diligForm__label" htmlFor="dilig-tipo">
                  Diligencia
                </label>
                <select
                  id="dilig-tipo"
                  className="diligForm__select"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                >
                  <option value="">SELECCION DILIGENCIAS</option>
                  {tiposActivos.map((t) => (
                    <option key={t.codigo} value={t.codigo}>
                      {display(t.etiquetaLegacy || t.etiqueta)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="diligForm__meta">
                <label className="diligForm__fecha">
                  <span className="diligForm__label">Fecha</span>
                  <input
                    type="date"
                    className="diligForm__input"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </label>
                <button
                  type="button"
                  className="diligForm__boletaLink"
                  onClick={handleOpenBoletaModal}
                >
                  Ingresar boleta receptor
                </button>
              </div>

              <div className="diligForm__row">
                <label className="diligForm__label" htmlFor="dilig-obs">
                  Observaciones
                </label>
                <textarea
                  id="dilig-obs"
                  className="diligForm__textarea"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>

              <div className="diligForm__actions">
                <button type="submit" className="diligForm__add" disabled={isSaving}>
                  {isSaving ? 'AGREGANDO…' : 'AGREGAR'}
                </button>
              </div>
            </form>

            {boletasReceptor.length > 0 ? (
              <section className="diligBoletas" aria-labelledby="dilig-boletas-title">
                <h2 id="dilig-boletas-title" className="diligBoletas__head">
                  Boletas receptor
                </h2>
                <ul className="diligBoletas__list">
                  {boletasReceptor.map((b) => (
                    <li key={b.id} className="diligBoletas__item">
                      <div className="diligBoletas__content">
                        <p className="diligBoletas__line">
                          Boleta {b.documento}
                          <span className="diligBoletas__sep"> · </span>
                          {display(b.receptor)}
                        </p>
                        <p className="diligBoletas__meta">
                          Monto: ${b.monto.toLocaleString('es-CL')}
                        </p>
                        {b.diligenciaEtiquetaLegacy ? (
                          <p className="diligList__obs">{display(b.diligenciaEtiquetaLegacy)}</p>
                        ) : null}
                      </div>
                      <div className="diligBoletas__actions">
                        <button
                          type="button"
                          className="diligBoletas__edit"
                          aria-label="Modificar boleta receptor"
                          title="Modificar"
                          onClick={() => handleEditarBoleta(b)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="diligList__remove"
                          aria-label="Eliminar boleta receptor"
                          title="Eliminar"
                          onClick={() => void handleEliminarBoleta(b)}
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <ExhortoDatosModal
              isOpen={datosModalOpen}
              exhorto={exhorto}
              onClose={handleCloseDatosModal}
              isSaving={isSavingDatos}
              error={datosModalError}
              onSave={handleGuardarDatos}
            />

            <BoletaReceptorModal
              isOpen={boletaModalOpen}
              boleta={editBoleta}
              onClose={handleCloseBoletaModal}
              isSaving={isSavingBoleta}
              error={boletaModalError}
              onSave={handleGuardarBoleta}
            />

            <ConfirmDialog
              isOpen={deleteDialog != null}
              title={deleteDialog?.title ?? ''}
              message={deleteDialog?.message ?? ''}
              detail={deleteDialog?.detail ?? ''}
              isBusy={isDeleting}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />

            <section className="diligList" aria-labelledby="dilig-list-title">
              <h2 id="dilig-list-title" className="diligList__head">
                Diligencias del exhorto
              </h2>
              {diligencias.length === 0 ? (
                <p className="diligList__empty">No hay diligencias registradas.</p>
              ) : (
                <ul className="diligList__body">
                  {diligencias.map((d) => {
                    const id = diligenciaId(d)
                    const etiqueta = display(d.etiquetaLegacy || d.etiqueta)
                    const fechaTxt = formatLegacyDate(d.fecha)
                    return (
                      <li key={id || `${d.codigo}-${d.fecha}`} className="diligList__item">
                        <div className="diligList__content">
                          <p className="diligList__user">
                            ingresado: {display(d.usuario)}
                          </p>
                          <p className="diligList__line">
                            {etiqueta}
                            {fechaTxt ? ` ${fechaTxt}` : ''}
                          </p>
                          {d.observaciones ? (
                            <p className="diligList__obs">{display(d.observaciones)}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="diligList__remove"
                          aria-label="Eliminar diligencia"
                          title="Eliminar"
                          onClick={() => void handleEliminar(d)}
                        >
                          ×
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  )
}
