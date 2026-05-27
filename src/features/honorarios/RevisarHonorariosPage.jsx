import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteHonorario,
  parseHonorariosSearchResponse,
  payHonorario,
  searchHonorarios,
  updateHonorario,
} from '../../api/honorariosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { AppShell } from '../layout/AppShell.jsx'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { BoletaHonorarioModal } from './components/BoletaHonorarioModal.jsx'
import { HonorariosResultsTable } from './components/HonorariosResultsTable.jsx'
import {
  downloadHonorariosExcel,
  fetchHonorariosForExport,
} from './honorariosExcelExport.js'
import '../dashboard/DashboardPage.css'
import './RevisarHonorariosPage.css'

const HONORARIOS_PAGE_SIZE = 20

const emptyFiltros = () => ({
  ciudad: '',
  abogado: '',
  caratula: '',
  rolJuicio: '',
  documento: '',
  pendiente: true,
  pagada: false,
  honorarios: true,
  devolucion: false,
})

/**
 * Revisión de boletas de honorarios y devoluciones (perfil TODO).
 */
export function RevisarHonorariosPage() {
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const [filtros, setFiltros] = useState(emptyFiltros)
  const [searchError, setSearchError] = useState(/** @type {string | null} */ (null))
  const [actionError, setActionError] = useState(/** @type {string | null} */ (null))
  const [isSearching, setIsSearching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [actionBusyId, setActionBusyId] = useState(/** @type {string | null} */ (null))
  const [editBoleta, setEditBoleta] = useState(
    /** @type {import('../../api/honorariosApi.js').BoletaHonorarioItem | null} */ (null),
  )
  const [deleteBoleta, setDeleteBoleta] = useState(
    /** @type {import('../../api/honorariosApi.js').BoletaHonorarioItem | null} */ (null),
  )
  const [modalError, setModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingModal, setIsSavingModal] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [lastSearchFilters, setLastSearchFilters] = useState(emptyFiltros)
  const [searchResult, setSearchResult] = useState(
    /** @type {{ data: import('../../api/honorariosApi.js').BoletaHonorarioItem[], total: number }} */ ({
      data: [],
      total: 0,
    }),
  )

  function setField(name, value) {
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const runSearch = useCallback(
    async (targetPage) => {
      setSearchError(null)
      setActionError(null)
      setIsSearching(true)
      try {
        const result = await searchHonorarios(apiClient, {
          ...filtros,
          page: targetPage,
          limit: HONORARIOS_PAGE_SIZE,
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
        const parsed = parseHonorariosSearchResponse(result)
        setSearchResult(parsed)
        setPage(targetPage)
        setLastSearchFilters({ ...filtros })
        setHasSearched(true)
      } catch {
        setSearchError('No se pudo buscar honorarios. Intenta de nuevo.')
      } finally {
        setIsSearching(false)
      }
    },
    [apiClient, clearSession, filtros, navigate],
  )

  async function handleBuscar(e) {
    e.preventDefault()
    await runSearch(1)
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || isSearching) return
    const totalPages = Math.max(
      1,
      Math.ceil(searchResult.total / HONORARIOS_PAGE_SIZE),
    )
    if (newPage > totalPages) return
    void runSearch(newPage)
  }

  async function handlePay(row) {
    if (!row.id) return
    setActionError(null)
    setActionBusyId(row.id)
    try {
      const result = await payHonorario(apiClient, row.id)
      if (!result.ok) {
        setActionError(result.message)
        return
      }
      await runSearch(page)
    } catch {
      setActionError('No se pudo marcar la boleta como pagada.')
    } finally {
      setActionBusyId(null)
    }
  }

  function handleEdit(row) {
    setModalError(null)
    setEditBoleta(row)
  }

  function handleCloseModal() {
    if (isSavingModal) return
    setEditBoleta(null)
    setModalError(null)
  }

  async function handleSaveBoleta(payload) {
    if (!editBoleta?.id) return
    setModalError(null)
    setIsSavingModal(true)
    try {
      const result = await updateHonorario(apiClient, editBoleta.id, payload)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setModalError(result.message)
        return
      }
      setEditBoleta(null)
      await runSearch(page)
    } catch {
      setModalError('No se pudo modificar la boleta.')
    } finally {
      setIsSavingModal(false)
    }
  }

  function handleDelete(row) {
    if (!row.id) return
    setActionError(null)
    setDeleteBoleta(row)
  }

  function handleCancelDelete() {
    if (actionBusyId) return
    setDeleteBoleta(null)
  }

  async function handleExport() {
    if (isExporting || searchResult.total === 0) return
    setActionError(null)
    setIsExporting(true)
    try {
      const result = await fetchHonorariosForExport(apiClient, lastSearchFilters)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setActionError(result.message)
        return
      }
      await downloadHonorariosExcel(result.data)
    } catch {
      setActionError('No se pudo exportar las boletas de honorarios.')
    } finally {
      setIsExporting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deleteBoleta?.id) return
    setActionError(null)
    setActionBusyId(deleteBoleta.id)
    try {
      const result = await deleteHonorario(apiClient, deleteBoleta.id)
      if (!result.ok) {
        setActionError(result.message)
        return
      }
      setDeleteBoleta(null)
      await runSearch(page)
    } catch {
      setActionError('No se pudo eliminar la boleta.')
    } finally {
      setActionBusyId(null)
    }
  }

  return (
    <AppShell activeNav="honorarios-revisar">
      <div className="dashMain__inner proModule">
        <header className="proPageHead">
          <h1 className="proPageHead__title">Revisar honorarios</h1>
          <p className="proPageHead__lead">
            Consulte y gestione boletas de honorarios y devoluciones vinculadas a sus
            exhortos.
          </p>
        </header>

        <section className="proPanel" aria-label="Búsqueda de honorarios">
          <div className="proPanel__body">
            <h2 className="proPanel__heading">
              Criterios de búsqueda
              <span className="proPanel__headingHint">
                Complete los campos que necesite y pulse buscar
              </span>
            </h2>
            <form className="dashForm proForm" onSubmit={handleBuscar}>
            {searchError ? (
              <p
                className="dashForm__feedback dashForm__feedback--error proForm__feedback"
                role="alert"
              >
                {searchError}
              </p>
            ) : null}
            {actionError ? (
              <p
                className="dashForm__feedback dashForm__feedback--error proForm__feedback"
                role="alert"
              >
                {actionError}
              </p>
            ) : null}

            <div className="proForm__row">
              <label className="dashField">
                <span className="dashField__label">Ciudad</span>
                <input
                  className="dashField__input"
                  value={filtros.ciudad}
                  onChange={(e) => setField('ciudad', e.target.value)}
                />
              </label>
              <label className="dashField">
                <span className="dashField__label">Abogado</span>
                <input
                  className="dashField__input"
                  value={filtros.abogado}
                  onChange={(e) => setField('abogado', e.target.value)}
                />
              </label>
              <div className="proForm__filterBox" role="group" aria-label="Estado de boleta">
                <p className="proForm__filterLabel">Estado de boleta</p>
                <div className="proForm__checks">
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.pendiente}
                      onChange={(e) => setField('pendiente', e.target.checked)}
                    />
                    Pendiente
                  </label>
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.pagada}
                      onChange={(e) => setField('pagada', e.target.checked)}
                    />
                    Pagada
                  </label>
                </div>
              </div>
            </div>

            <div className="proForm__row">
              <label className="dashField">
                <span className="dashField__label">Carátula</span>
                <input
                  className="dashField__input"
                  value={filtros.caratula}
                  onChange={(e) => setField('caratula', e.target.value)}
                />
              </label>
              <label className="dashField">
                <span className="dashField__label">Rol exhorto</span>
                <input
                  className="dashField__input"
                  value={filtros.rolJuicio}
                  onChange={(e) => setField('rolJuicio', e.target.value)}
                />
              </label>
              <div className="proForm__filterBox" role="group" aria-label="Tipo de boleta">
                <p className="proForm__filterLabel">Tipo de boleta</p>
                <div className="proForm__checks">
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.honorarios}
                      onChange={(e) => setField('honorarios', e.target.checked)}
                    />
                    Honorarios
                  </label>
                  <label className="dashCheck">
                    <input
                      type="checkbox"
                      checked={filtros.devolucion}
                      onChange={(e) => setField('devolucion', e.target.checked)}
                    />
                    Devolución
                  </label>
                </div>
              </div>
            </div>

            <div className="proForm__row proForm__row--last">
              <label className="dashField">
                <span className="dashField__label">Número documento</span>
                <input
                  className="dashField__input"
                  inputMode="numeric"
                  value={filtros.documento}
                  onChange={(e) =>
                    setField('documento', e.target.value.replace(/\D/g, ''))
                  }
                />
              </label>
              <div />
              <div className="proForm__searchCol">
                <button
                  type="submit"
                  className="dashForm__search proForm__search"
                  disabled={isSearching}
                >
                  {isSearching ? 'Buscando…' : 'Buscar'}
                </button>
              </div>
            </div>
          </form>

          {hasSearched ? (
            <HonorariosResultsTable
              items={searchResult.data}
              total={searchResult.total}
              page={page}
              pageSize={HONORARIOS_PAGE_SIZE}
              isLoading={isSearching}
              actionBusyId={actionBusyId}
              onPageChange={handlePageChange}
              onOpenExhorto={(exhortoId) => {
                navigate(`/exhortos/${exhortoId}/diligencias`)
              }}
              onEdit={handleEdit}
              onPay={handlePay}
              onDelete={handleDelete}
              isExporting={isExporting}
              onExport={handleExport}
            />
          ) : null}
          </div>
        </section>

        <BoletaHonorarioModal
          isOpen={editBoleta != null}
          boleta={editBoleta}
          onClose={handleCloseModal}
          isSaving={isSavingModal}
          error={modalError}
          onSave={handleSaveBoleta}
        />

        <ConfirmDialog
          isOpen={deleteBoleta != null}
          title="Eliminar boleta de honorarios"
          message="Esta acción eliminará la boleta seleccionada del registro de honorarios."
          detail={
            deleteBoleta
              ? `Documento ${deleteBoleta.documento ?? 'sin número'} · Monto ${
                  typeof deleteBoleta.monto === 'number'
                    ? `$${deleteBoleta.monto.toLocaleString('es-CL')}`
                    : 'sin monto'
                }`
              : ''
          }
          isBusy={actionBusyId === deleteBoleta?.id}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  )
}
