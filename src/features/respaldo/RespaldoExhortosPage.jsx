import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  moveExhortosToBackup,
  parseExhortoSearchResponse,
  recoverExhortosFromBackup,
  searchExhortosBackup,
} from '../../api/exhortosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { useDiligenciaTipos } from '../../hooks/useDiligenciaTipos.js'
import { validateFechaRango } from '../../utils/validateFechaRango.js'
import { ExhortosResultsTable } from '../dashboard/components/ExhortosResultsTable.jsx'
import '../dashboard/DashboardPage.css'
import { AppShell } from '../layout/AppShell.jsx'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import {
  DiligenciaTipoSelect,
  getDiligenciaTipoLabel,
} from '../shared/DiligenciaTipoSelect.jsx'
import '../shared/proModule.css'
import './RespaldoExhortosPage.css'

const emptyResult = () => ({
  matched: 0,
  moved: 0,
  deleted: 0,
})

const RESPALDO_PAGE_SIZE = 20

const emptySearchResult = () => ({
  data: [],
  total: 0,
})

/**
 * Respaldo administrativo de exhortos terminados hacia respaldo_exhorto.
 */
export function RespaldoExhortosPage() {
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [diligenciaCodigo, setDiligenciaCodigo] = useState('')
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [success, setSuccess] = useState(/** @type {string | null} */ (null))
  const [result, setResult] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoBackupMoveResult | null} */ (null),
  )
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [searchFechaDesde, setSearchFechaDesde] = useState('')
  const [searchFechaHasta, setSearchFechaHasta] = useState('')
  const [searchDiligenciaCodigo, setSearchDiligenciaCodigo] = useState('')
  const [searchEstado, setSearchEstado] = useState('0')
  const { diligenciaTipos } = useDiligenciaTipos(apiClient)
  const [searchError, setSearchError] = useState(/** @type {string | null} */ (null))
  const [isSearchingBackup, setIsSearchingBackup] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [isRecoverConfirmOpen, setIsRecoverConfirmOpen] = useState(false)
  const [recoverResult, setRecoverResult] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoBackupMoveResult | null} */ (null),
  )
  const [hasSearchedBackup, setHasSearchedBackup] = useState(false)
  const [backupPage, setBackupPage] = useState(1)
  const [backupResult, setBackupResult] = useState(
    /** @type {{ data: import('../../api/exhortosApi.js').ExhortoListItem[], total: number }} */ (
      emptySearchResult()
    ),
  )

  function validateDates() {
    if (!fechaDesde || !fechaHasta) {
      return 'Selecciona fecha desde y fecha hasta.'
    }
    return validateFechaRango(fechaDesde, fechaHasta)
  }

  function validateSearchDates() {
    if (!searchFechaDesde || !searchFechaHasta) {
      return 'Selecciona fecha desde y fecha hasta para consultar respaldados.'
    }
    return validateFechaRango(searchFechaDesde, searchFechaHasta)
  }

  function formatRespaldoDetail(desde, hasta, diligencia, estadoLabel) {
    const parts = [`${desde || 'sin fecha desde'} al ${hasta || 'sin fecha hasta'}`]
    if (diligencia) {
      parts.push(`Diligencia: ${getDiligenciaTipoLabel(diligencia, diligenciaTipos)}`)
    }
    if (estadoLabel) parts.push(`Estado: ${estadoLabel}`)
    return parts.join(' · ')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setResult(null)

    const validation = validateDates()
    if (validation) {
      setError(validation)
      return
    }

    setIsConfirmOpen(true)
  }

  function handleCloseConfirm() {
    if (isMoving) return
    setIsConfirmOpen(false)
  }

  async function handleConfirmMove() {
    const validation = validateDates()
    if (validation) {
      setError(validation)
      setIsConfirmOpen(false)
      return
    }

    setError(null)
    setSuccess(null)
    setIsMoving(true)
    try {
      const response = await moveExhortosToBackup(apiClient, {
        fechaDesde,
        fechaHasta,
        ...(diligenciaCodigo ? { diligenciaCodigo } : {}),
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(response.message)
        return
      }

      const payload =
        response.data && typeof response.data === 'object'
          ? /** @type {Partial<import('../../api/exhortosApi.js').ExhortoBackupMoveResult>} */ (
              response.data
            )
          : emptyResult()

      const nextResult = {
        matched: typeof payload.matched === 'number' ? payload.matched : 0,
        moved: typeof payload.moved === 'number' ? payload.moved : 0,
        deleted: typeof payload.deleted === 'number' ? payload.deleted : 0,
      }

      setResult(nextResult)
      setSuccess(
        `Respaldo completado: ${nextResult.moved} exhortos movidos y ${nextResult.deleted} eliminados de la colección activa.`,
      )
      setIsConfirmOpen(false)
    } catch {
      setError('No se pudo ejecutar el respaldo de exhortos.')
    } finally {
      setIsMoving(false)
    }
  }

  async function runBackupSearch(targetPage) {
    const validation = validateSearchDates()
    if (validation) {
      setSearchError(validation)
      return
    }

    setSearchError(null)
    setIsSearchingBackup(true)
    try {
      const response = await searchExhortosBackup(apiClient, {
        fechaDesde: searchFechaDesde,
        fechaHasta: searchFechaHasta,
        estado: Number.parseInt(searchEstado, 10),
        ...(searchDiligenciaCodigo ? { diligenciaCodigo: searchDiligenciaCodigo } : {}),
        page: targetPage,
        limit: RESPALDO_PAGE_SIZE,
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setSearchError(response.message)
        setHasSearchedBackup(false)
        return
      }

      const parsed = parseExhortoSearchResponse(response.data)
      setBackupResult(parsed)
      setBackupPage(targetPage)
      setHasSearchedBackup(true)
    } catch {
      setSearchError('No se pudo consultar la colección de respaldo.')
    } finally {
      setIsSearchingBackup(false)
    }
  }

  function handleSearchBackup(e) {
    e.preventDefault()
    void runBackupSearch(1)
  }

  function handleBackupPageChange(nextPage) {
    if (nextPage < 1 || isSearchingBackup) return
    const totalPages = Math.max(1, Math.ceil(backupResult.total / RESPALDO_PAGE_SIZE))
    if (nextPage > totalPages) return
    void runBackupSearch(nextPage)
  }

  function handleOpenRecoverConfirm() {
    setSearchError(null)
    setRecoverResult(null)
    const validation = validateSearchDates()
    if (validation) {
      setSearchError(validation)
      return
    }
    setIsRecoverConfirmOpen(true)
  }

  function handleCloseRecoverConfirm() {
    if (isRecovering) return
    setIsRecoverConfirmOpen(false)
  }

  async function handleConfirmRecover() {
    const validation = validateSearchDates()
    if (validation) {
      setSearchError(validation)
      setIsRecoverConfirmOpen(false)
      return
    }

    setSearchError(null)
    setIsRecovering(true)
    try {
      const response = await recoverExhortosFromBackup(apiClient, {
        fechaDesde: searchFechaDesde,
        fechaHasta: searchFechaHasta,
        estado: Number.parseInt(searchEstado, 10),
        ...(searchDiligenciaCodigo ? { diligenciaCodigo: searchDiligenciaCodigo } : {}),
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setSearchError(response.message)
        return
      }

      const payload =
        response.data && typeof response.data === 'object'
          ? /** @type {Partial<import('../../api/exhortosApi.js').ExhortoBackupMoveResult>} */ (
              response.data
            )
          : emptyResult()

      const nextResult = {
        matched: typeof payload.matched === 'number' ? payload.matched : 0,
        moved: typeof payload.moved === 'number' ? payload.moved : 0,
        deleted: typeof payload.deleted === 'number' ? payload.deleted : 0,
      }

      setRecoverResult(nextResult)
      setSearchError(null)
      setIsRecoverConfirmOpen(false)
      await runBackupSearch(1)
    } catch {
      setSearchError('No se pudo recuperar los exhortos respaldados.')
    } finally {
      setIsRecovering(false)
    }
  }

  return (
    <AppShell activeNav="respaldo-exhortos">
      <div className="dashMain__inner proModule respaldoPage">
        <header className="proPageHead">
          <h1 className="proPageHead__title">Respaldo de exhortos</h1>
          <p className="proPageHead__lead">
            Mueve exhortos terminados desde la colección activa hacia
            <strong> respaldo_exhorto</strong>, filtrando por tipo de diligencia y fechas.
          </p>
        </header>

        <section className="proPanel" aria-label="Formulario de respaldo de exhortos">
          <div className="proPanel__body">
            <h2 className="proPanel__heading">
              Rango de respaldo
              <span className="proPanel__headingHint">
                Solo se consideran exhortos terminados con diligencias dentro del rango.
              </span>
            </h2>

            {error ? (
              <p className="dashForm__feedback dashForm__feedback--error proForm__feedback" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="dashForm__feedback dashForm__feedback--ok proForm__feedback" role="status">
                {success}
              </p>
            ) : null}

            <form className="respaldoForm" onSubmit={handleSubmit}>
              <div className="respaldoForm__dates">
                <label className="dashField">
                  <span className="dashField__label">Fecha desde</span>
                  <input
                    type="date"
                    className="dashField__input"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    disabled={isMoving}
                  />
                </label>
                <label className="dashField">
                  <span className="dashField__label">Fecha hasta</span>
                  <input
                    type="date"
                    className="dashField__input"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    disabled={isMoving}
                  />
                </label>
                <label className="dashField">
                  <span className="dashField__label">Diligencia</span>
                  <DiligenciaTipoSelect
                    value={diligenciaCodigo}
                    onChange={setDiligenciaCodigo}
                    tipos={diligenciaTipos}
                    disabled={isMoving}
                  />
                </label>
              </div>

              <div className="respaldoNotice" role="note">
                <strong>Importante:</strong> esta operación copia los documentos completos a
                <code> respaldo_exhorto</code> y luego los elimina de
                <code> exhortos</code>.
              </div>

              <div className="respaldoForm__actions">
                <button
                  type="submit"
                  className="proPanel__btnPrimary respaldoForm__submit"
                  disabled={isMoving}
                >
                  {isMoving ? 'Moviendo exhortos...' : 'Ejecutar respaldo'}
                </button>
              </div>
            </form>

            {result ? (
              <dl className="respaldoResult" aria-label="Resultado del respaldo">
                <div className="respaldoResult__item">
                  <dt>Encontrados</dt>
                  <dd>{result.matched}</dd>
                </div>
                <div className="respaldoResult__item">
                  <dt>Movidos</dt>
                  <dd>{result.moved}</dd>
                </div>
                <div className="respaldoResult__item">
                  <dt>Eliminados</dt>
                  <dd>{result.deleted}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        </section>

        <section className="proPanel respaldoSearchPanel" aria-label="Consulta de exhortos respaldados">
          <div className="proPanel__body">
            <h2 className="proPanel__heading">
              Consultar respaldados
              <span className="proPanel__headingHint">
                Busca exhortos almacenados en la colección respaldo_exhorto.
              </span>
            </h2>

            {searchError ? (
              <p className="dashForm__feedback dashForm__feedback--error proForm__feedback" role="alert">
                {searchError}
              </p>
            ) : null}
            {recoverResult ? (
              <p className="dashForm__feedback dashForm__feedback--ok proForm__feedback" role="status">
                Recuperación completada: {recoverResult.moved} exhortos devueltos a
                la colección activa y {recoverResult.deleted} eliminados del respaldo.
              </p>
            ) : null}

            <form className="respaldoForm respaldoSearchForm" onSubmit={handleSearchBackup}>
              <div className="respaldoForm__dates respaldoSearchForm__grid">
                <label className="dashField">
                  <span className="dashField__label">Fecha desde</span>
                  <input
                    type="date"
                    className="dashField__input"
                    value={searchFechaDesde}
                    onChange={(e) => setSearchFechaDesde(e.target.value)}
                    disabled={isSearchingBackup}
                  />
                </label>
                <label className="dashField">
                  <span className="dashField__label">Fecha hasta</span>
                  <input
                    type="date"
                    className="dashField__input"
                    value={searchFechaHasta}
                    onChange={(e) => setSearchFechaHasta(e.target.value)}
                    disabled={isSearchingBackup}
                  />
                </label>
                <label className="dashField">
                  <span className="dashField__label">Estado</span>
                  <select
                    className="dashField__input"
                    value={searchEstado}
                    onChange={(e) => setSearchEstado(e.target.value)}
                    disabled={isSearchingBackup}
                  >
                    <option value="0">Terminado</option>
                    <option value="1">Vigente</option>
                  </select>
                </label>
                <label className="dashField">
                  <span className="dashField__label">Diligencia</span>
                  <DiligenciaTipoSelect
                    value={searchDiligenciaCodigo}
                    onChange={setSearchDiligenciaCodigo}
                    tipos={diligenciaTipos}
                    disabled={isSearchingBackup || isRecovering}
                  />
                </label>
              </div>

              <div className="respaldoForm__actions respaldoForm__actions--split">
                <button
                  type="submit"
                  className="proPanel__btnPrimary respaldoForm__submit"
                  disabled={isSearchingBackup || isRecovering}
                >
                  {isSearchingBackup ? 'Buscando...' : 'Buscar respaldados'}
                </button>
                <button
                  type="button"
                  className="respaldoForm__recoverBtn"
                  disabled={isSearchingBackup || isRecovering}
                  onClick={handleOpenRecoverConfirm}
                >
                  {isRecovering ? 'Recuperando...' : 'Recuperar a exhortos'}
                </button>
              </div>
            </form>

            {hasSearchedBackup ? (
              <ExhortosResultsTable
                items={backupResult.data}
                total={backupResult.total}
                page={backupPage}
                pageSize={RESPALDO_PAGE_SIZE}
                isLoading={isSearchingBackup}
                onPageChange={handleBackupPageChange}
              />
            ) : null}
          </div>
        </section>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Confirmar respaldo de exhortos"
          message="Se moverán los exhortos terminados que coincidan con el filtro de diligencia y fechas."
          detail={formatRespaldoDetail(fechaDesde, fechaHasta, diligenciaCodigo)}
          confirmLabel="Mover a respaldo"
          isBusy={isMoving}
          tone="warning"
          onCancel={handleCloseConfirm}
          onConfirm={handleConfirmMove}
        />

        <ConfirmDialog
          isOpen={isRecoverConfirmOpen}
          title="Confirmar recuperación de respaldo"
          message="Se copiarán los exhortos respaldados a la colección principal y luego se eliminarán del respaldo."
          detail={formatRespaldoDetail(
            searchFechaDesde,
            searchFechaHasta,
            searchDiligenciaCodigo,
            searchEstado === '0' ? 'Terminado' : 'Vigente',
          )}
          confirmLabel="Recuperar"
          isBusy={isRecovering}
          tone="warning"
          onCancel={handleCloseRecoverConfirm}
          onConfirm={handleConfirmRecover}
        />
      </div>
    </AppShell>
  )
}
