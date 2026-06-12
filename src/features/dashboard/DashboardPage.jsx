import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deleteExhorto,
  parseExhortoSearchResponse,
  searchExhortos,
  updateExhorto,
} from '../../api/exhortosApi.js'
import { BOLETA_TIPO, createHonorario } from '../../api/honorariosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { useUserPerfil } from '../../auth/hooks/useUserPerfil.js'
import { useDiligenciaTipos } from '../../hooks/useDiligenciaTipos.js'
import { validateFechaRango } from '../../utils/validateFechaRango.js'
import { AppShell } from '../layout/AppShell.jsx'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { BoletaHonorarioModal } from '../honorarios/components/BoletaHonorarioModal.jsx'
import { DiligenciaTipoSelect } from '../shared/DiligenciaTipoSelect.jsx'
import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'
import { ExhortoDatosModal } from '../exhortos/components/ExhortoDatosModal.jsx'
import { ExhortosResultsTable } from './components/ExhortosResultsTable.jsx'
import {
  downloadExhortosExcel,
  fetchAllExhortosForExport,
} from './exhortosExcelExport.js'
import {
  areExhortoFiltersEqual,
  listActiveExhortoFilterLabels,
} from './exhortoFiltersUtils.js'
import {
  clearDashboardSearchSession,
  writeDashboardSearchSession,
} from './dashboardSearchSession.js'
import './DashboardPage.css'

const EXHORTOS_PAGE_SIZE = 20

const emptyFiltros = () => ({
  apellidoDeudor: '',
  nombreCliente: '',
  tribunalOrigen: '',
  rolJuicio: '',
  ciudad: '',
  facultades: '',
  abogado: '',
  desde: '',
  hasta: '',
  diligenciaCodigo: '',
  terminado: false,
  vigente: true,
})

/**
 * Búsqueda de exhortos (menú EXHORTO).
 */
export function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const { canIngresarExhorto, isTodo } = useUserPerfil()
  const [filtros, setFiltros] = useState(emptyFiltros)
  const [searchError, setSearchError] = useState(/** @type {string | null} */ (null))
  const [isSearching, setIsSearching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [actionBusyId, setActionBusyId] = useState(/** @type {string | null} */ (null))
  const [deleteTarget, setDeleteTarget] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoListItem | null} */ (null),
  )
  const [boletaRequest, setBoletaRequest] = useState(
    /** @type {null | { row: import('../../api/exhortosApi.js').ExhortoListItem, tipo: number }} */ (
      null
    ),
  )
  const [boletaModalError, setBoletaModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingBoleta, setIsSavingBoleta] = useState(false)
  const [editExhortoTarget, setEditExhortoTarget] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoListItem | null} */ (null),
  )
  const [datosModalError, setDatosModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingDatos, setIsSavingDatos] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [lastSearchFilters, setLastSearchFilters] = useState(emptyFiltros)
  const [searchResult, setSearchResult] = useState(
    /** @type {{ data: import('../../api/exhortosApi.js').ExhortoListItem[], total: number }} */ ({
      data: [],
      total: 0,
    }),
  )
  const { diligenciaTipos } = useDiligenciaTipos(apiClient)

  const filtersStale = useMemo(
    () => hasSearched && !areExhortoFiltersEqual(filtros, lastSearchFilters),
    [filtros, hasSearched, lastSearchFilters],
  )

  const appliedFilterLabels = useMemo(
    () => listActiveExhortoFilterLabels(lastSearchFilters),
    [lastSearchFilters],
  )

  function setField(name, value) {
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const resetSearchForm = useCallback(() => {
    const empty = emptyFiltros()
    setFiltros(empty)
    setLastSearchFilters(empty)
    setPage(1)
    setHasSearched(false)
    setSearchResult({ data: [], total: 0 })
    setSearchError(null)
    clearDashboardSearchSession()
  }, [])

  const runSearch = useCallback(
    async (targetPage, filtersOverride) => {
      const activeFilters = filtersOverride ?? filtros
      const dateValidation = validateFechaRango(activeFilters.desde, activeFilters.hasta)
      if (dateValidation) {
        setSearchError(dateValidation)
        return
      }

      setSearchError(null)
      setIsSearching(true)
      try {
        const result = await searchExhortos(apiClient, {
          ...activeFilters,
          page: targetPage,
          limit: EXHORTOS_PAGE_SIZE,
        })
        if (!result.ok) {
          if (result.status === 401) {
            clearSession()
            navigate('/login', { replace: true })
            return
          }
          setSearchError(result.message)
          setHasSearched(false)
          return
        }
        const parsed = parseExhortoSearchResponse(result.data)
        const filtersSnap = { ...activeFilters }
        setSearchResult(parsed)
        setPage(targetPage)
        setLastSearchFilters(filtersSnap)
        setHasSearched(true)
        writeDashboardSearchSession({
          filtros: filtersSnap,
          lastSearchFilters: filtersSnap,
          page: targetPage,
          hasSearched: true,
          searchResult: parsed,
          needsRefresh: false,
        })
      } catch {
        setSearchError('No se pudo buscar exhortos. Intenta de nuevo.')
      } finally {
        setIsSearching(false)
      }
    },
    [apiClient, clearSession, filtros, navigate],
  )

  useEffect(() => {
    if (!location.state?.resetExhortoSearch) return
    resetSearchForm()
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate, resetSearchForm])

  async function handleBuscar(e) {
    e.preventDefault()
    await runSearch(1)
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || isSearching) return
    const totalPages = Math.max(
      1,
      Math.ceil(searchResult.total / EXHORTOS_PAGE_SIZE),
    )
    if (newPage > totalPages) return
    void runSearch(newPage, lastSearchFilters)
  }

  async function handleExport() {
    if (isExporting || searchResult.total === 0) return
    setSearchError(null)
    setIsExporting(true)
    try {
      const result = await fetchAllExhortosForExport(
        apiClient,
        lastSearchFilters,
        searchResult.total,
      )
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setSearchError(result.message)
        return
      }
      await downloadExhortosExcel(result.data)
    } catch {
      setSearchError('No se pudo exportar el resultado de exhortos.')
    } finally {
      setIsExporting(false)
    }
  }

  function handleDelete(row) {
    if (!row.id) return
    setSearchError(null)
    setDeleteTarget(row)
  }

  function handleCancelDelete() {
    if (actionBusyId) return
    setDeleteTarget(null)
  }

  function exhortoCaratula(row) {
    const cliente = fixLegacyEncoding(row.nombreCliente ?? '').trim()
    const deudor = fixLegacyEncoding(row.apellidoDeudor ?? '').trim()
    if (cliente && deudor) return `${cliente} con ${deudor}`
    return cliente || deudor || 'Sin carátula'
  }

  function handleOpenHonorario(row) {
    if (!row.id) return
    setBoletaModalError(null)
    setBoletaRequest({ row, tipo: BOLETA_TIPO.HONORARIO })
  }

  function handleOpenDevolucion(row) {
    if (!row.id) return
    setBoletaModalError(null)
    setBoletaRequest({ row, tipo: BOLETA_TIPO.DEVOLUCION })
  }

  function handleCloseBoletaModal() {
    if (isSavingBoleta) return
    setBoletaRequest(null)
    setBoletaModalError(null)
  }

  /**
   * @param {import('../../api/exhortosApi.js').ExhortoListItem} row
   */
  function handleOpenEditExhorto(row) {
    if (!row.id) return
    setDatosModalError(null)
    setEditExhortoTarget(row)
  }

  function handleCloseDatosModal() {
    if (isSavingDatos) return
    setEditExhortoTarget(null)
    setDatosModalError(null)
  }

  /**
   * @param {import('../../api/exhortosApi.js').UpdateExhortoBody} payload
   */
  async function handleGuardarDatosExhorto(payload) {
    if (!editExhortoTarget?.id) return
    setDatosModalError(null)
    setIsSavingDatos(true)
    setActionBusyId(editExhortoTarget.id)
    try {
      const result = await updateExhorto(apiClient, editExhortoTarget.id, payload)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setDatosModalError(result.message)
        return
      }
      setEditExhortoTarget(null)
      await runSearch(page, lastSearchFilters)
    } catch {
      setDatosModalError('No se pudo modificar el exhorto.')
    } finally {
      setIsSavingDatos(false)
      setActionBusyId(null)
    }
  }

  async function handleSaveBoleta(payload) {
    if (!boletaRequest?.row.id) return
    setBoletaModalError(null)
    setIsSavingBoleta(true)
    try {
      const result = await createHonorario(apiClient, {
        exhortoId: boletaRequest.row.id,
        tipo: boletaRequest.tipo,
        ...payload,
      })
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setBoletaModalError(result.message)
        return
      }
      setBoletaRequest(null)
      await runSearch(page, lastSearchFilters)
    } catch {
      setBoletaModalError('No se pudo guardar la boleta.')
    } finally {
      setIsSavingBoleta(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget?.id) return
    setSearchError(null)
    setActionBusyId(deleteTarget.id)
    try {
      const result = await deleteExhorto(apiClient, deleteTarget.id)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setSearchError(result.message)
        return
      }

      const nextTotal = Math.max(0, searchResult.total - 1)
      const nextPage = Math.min(
        page,
        Math.max(1, Math.ceil(nextTotal / EXHORTOS_PAGE_SIZE)),
      )
      setDeleteTarget(null)
      await runSearch(nextPage, lastSearchFilters)
    } catch {
      setSearchError('No se pudo eliminar el exhorto.')
    } finally {
      setActionBusyId(null)
    }
  }

  return (
    <AppShell activeNav="exhorto">
      <div className="dashMain__inner">
        <header className="dashMain__pageHead dashMain__pageHead--split">
          <p className="dashMain__crumb">Exhortos ingresados</p>
          {canIngresarExhorto ? (
            <button
              type="button"
              className="dashMain__ingresarBtn"
              onClick={() => navigate('/exhortos/ingresar')}
            >
              Ingresar exhorto
            </button>
          ) : null}
        </header>

        <section className="dashCard" aria-labelledby="dash-exhortos-title">
          <div className="dashCard__head">
            <h2 id="dash-exhortos-title" className="dashCard__title">
              Exhortos
            </h2>
            <p className="dashCard__subtitle">
              Busca por deudor, tribunal, tipo de diligencia, fechas o estado del expediente.
            </p>
          </div>

          <form className="dashForm" onSubmit={handleBuscar}>
            {searchError ? (
              <p className="dashForm__feedback dashForm__feedback--error" role="alert">
                {searchError}
              </p>
            ) : null}
            <div className="dashForm__grid">
              <label className="dashField">
                <span className="dashField__label">Apellido deudor</span>
                <input
                  className="dashField__input"
                  value={filtros.apellidoDeudor}
                  onChange={(e) => setField('apellidoDeudor', e.target.value)}
                  autoComplete="family-name"
                />
              </label>
              <label className="dashField">
                <span className="dashField__label">Nombre cliente</span>
                <input
                  className="dashField__input"
                  value={filtros.nombreCliente}
                  onChange={(e) => setField('nombreCliente', e.target.value)}
                  autoComplete="name"
                />
              </label>

              <label className="dashField">
                <span className="dashField__label">Tribunal origen</span>
                <input
                  className="dashField__input"
                  value={filtros.tribunalOrigen}
                  onChange={(e) => setField('tribunalOrigen', e.target.value)}
                />
              </label>
              <label className="dashField">
                <span className="dashField__label">Rol Juicio</span>
                <input
                  className="dashField__input"
                  value={filtros.rolJuicio}
                  onChange={(e) => setField('rolJuicio', e.target.value)}
                />
              </label>
              <label className="dashField">
                <span className="dashField__label">Ciudad</span>
                <input
                  className="dashField__input"
                  value={filtros.ciudad}
                  onChange={(e) => setField('ciudad', e.target.value)}
                />
              </label>

              <label className="dashField">
                <span className="dashField__label">Facultades</span>
                <input
                  className="dashField__input"
                  value={filtros.facultades}
                  onChange={(e) => setField('facultades', e.target.value)}
                />
              </label>
              <label className="dashField dashField--abogado">
                <span className="dashField__label">Abogado</span>
                <input
                  className="dashField__input"
                  value={filtros.abogado}
                  onChange={(e) => setField('abogado', e.target.value)}
                />
              </label>

              <fieldset className="dashForm__dateGroup">
                <legend className="dashForm__groupTitle">Rango de fechas</legend>
                <div className="dashForm__dateFields">
                  <label className="dashField">
                    <span className="dashField__label">Desde</span>
                    <input
                      type="date"
                      className="dashField__input"
                      value={filtros.desde}
                      onChange={(e) => setField('desde', e.target.value)}
                    />
                  </label>
                  <label className="dashField">
                    <span className="dashField__label">Hasta</span>
                    <input
                      type="date"
                      className="dashField__input"
                      value={filtros.hasta}
                      onChange={(e) => setField('hasta', e.target.value)}
                    />
                  </label>
                </div>
              </fieldset>

              <div className="dashForm__actions">
                <div className="dashForm__checks" aria-label="Estado y diligencia">
                  <span className="dashForm__groupTitle">Estado</span>
                  <label className="dashForm__diligenciaField">
                    <span className="dashForm__diligenciaLabel">Diligencia</span>
                    <DiligenciaTipoSelect
                      value={filtros.diligenciaCodigo}
                      onChange={(value) => setField('diligenciaCodigo', value)}
                      tipos={diligenciaTipos}
                      disabled={isSearching}
                      className="dashField__input dashForm__diligenciaSelect"
                    />
                  </label>
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.terminado}
                      onChange={(e) => setField('terminado', e.target.checked)}
                    />
                    Terminado
                  </label>
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.vigente}
                      onChange={(e) => setField('vigente', e.target.checked)}
                    />
                    Vigente
                  </label>
                </div>

                <div className="dashForm__searchWrap">
                  <button
                    type="submit"
                    className="dashForm__search"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Buscando…' : 'Buscar'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {hasSearched ? (
            <ExhortosResultsTable
              items={searchResult.data}
              total={searchResult.total}
              page={page}
              pageSize={EXHORTOS_PAGE_SIZE}
              isLoading={isSearching}
              isExporting={isExporting}
              filtersStale={filtersStale}
              appliedFilterLabels={appliedFilterLabels}
              actionBusyId={actionBusyId}
              onPageChange={handlePageChange}
              onExport={handleExport}
              onEdit={(row) => {
                if (row.id) {
                  navigate(`/exhortos/${row.id}/diligencias`)
                }
              }}
              onModifyExhorto={handleOpenEditExhorto}
              onDelete={handleDelete}
              onHonorario={isTodo ? handleOpenHonorario : undefined}
              onDevolucion={isTodo ? handleOpenDevolucion : undefined}
            />
          ) : null}
        </section>

        <ExhortoDatosModal
          isOpen={editExhortoTarget != null}
          exhorto={editExhortoTarget}
          onClose={handleCloseDatosModal}
          isSaving={isSavingDatos}
          error={datosModalError}
          onSave={handleGuardarDatosExhorto}
        />

        <BoletaHonorarioModal
          isOpen={boletaRequest != null}
          createRequest={
            boletaRequest
              ? {
                  tipo: boletaRequest.tipo,
                  caratula: exhortoCaratula(boletaRequest.row),
                }
              : null
          }
          isSaving={isSavingBoleta}
          error={boletaModalError}
          onClose={handleCloseBoletaModal}
          onSave={handleSaveBoleta}
        />

        <ConfirmDialog
          isOpen={deleteTarget != null}
          title="Eliminar exhorto"
          message="Esta acción eliminará el exhorto seleccionado junto con sus diligencias asociadas."
          detail={
            deleteTarget
              ? `${deleteTarget.nombreCliente ?? ''} con ${
                  deleteTarget.apellidoDeudor ?? ''
                } · ${deleteTarget.rolJuicio || 'Sin rol'}`
              : ''
          }
          isBusy={actionBusyId === deleteTarget?.id}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  )
}
