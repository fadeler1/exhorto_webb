import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './ExhortosResultsTable.css'

const PAGE_SIZE_DEFAULT = 20

/**
 * @param {string | null | undefined} value
 */
function displayText(value) {
  return fixLegacyEncoding((value ?? '').trim()) || '—'
}

/**
 * @param {number} total
 * @param {number} pageSize
 */
export function getTotalPages(total, pageSize = PAGE_SIZE_DEFAULT) {
  if (total <= 0) return 1
  return Math.ceil(total / pageSize)
}

/**
 * @param {{ nombreCliente?: string, apellidoDeudor?: string }} props
 */
function CaratulaCell({ nombreCliente, apellidoDeudor }) {
  const cliente = displayText(nombreCliente)
  const deudor = displayText(apellidoDeudor)
  return (
    <div className="exhortosTable__caratula">
      <span className="exhortosTable__caratulaLine">{cliente}</span>
      <span className="exhortosTable__caratulaCon">CON</span>
      <span className="exhortosTable__caratulaLine">{deudor}</span>
    </div>
  )
}

/**
 * @param {{ estado?: number }} row
 */
function EstadoBadge({ estado }) {
  const isTerminado = estado === 0
  return (
    <span
      className={`exhortosTable__badge ${
        isTerminado ? 'exhortosTable__badge--terminado' : 'exhortosTable__badge--vigente'
      }`}
    >
      {isTerminado ? 'TERMINADO' : 'VIGENTE'}
    </span>
  )
}

function IconFilter() {
  return (
    <svg className="exhortosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path fill="currentColor" d="M1 3h14l-5.5 6.3V14L7 12V9.3L1 3z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className="exhortosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z"
      />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg className="exhortosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M2 14V2h5v3h2V2h5v12H2Zm2-2h2V8H4v4Zm4 0h2V8H8v4Zm4 0h2V8h-2v4Z"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="exhortosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M13.5 2.5 6 10 2.5 6.5 1 8l5 5 9-9-1.5-1.5Z"
      />
    </svg>
  )
}

/**
 * @param {{
 *   items: import('../../../api/exhortosApi.js').ExhortoListItem[]
 *   total: number
 *   page: number
 *   pageSize?: number
 *   isLoading?: boolean
 *   isExporting?: boolean
 *   filtersStale?: boolean
 *   appliedFilterLabels?: string[]
 *   onPageChange: (page: number) => void
 *   onExport?: () => void
 *   onEdit?: (row: import('../../../api/exhortosApi.js').ExhortoListItem) => void
 *   onDelete?: (row: import('../../../api/exhortosApi.js').ExhortoListItem) => void
 *   onHonorario?: (row: import('../../../api/exhortosApi.js').ExhortoListItem) => void
 *   onDevolucion?: (row: import('../../../api/exhortosApi.js').ExhortoListItem) => void
 *   actionBusyId?: string | null
 * }} props
 */
export function ExhortosResultsTable({
  items,
  total,
  page,
  pageSize = PAGE_SIZE_DEFAULT,
  isLoading = false,
  isExporting = false,
  filtersStale = false,
  appliedFilterLabels = [],
  onPageChange,
  onExport,
  onEdit,
  onDelete,
  onHonorario,
  onDevolucion,
  actionBusyId = null,
}) {
  const totalPages = getTotalPages(total, pageSize)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(page * pageSize, total)
  const hasActions = Boolean(onEdit || onDelete || onHonorario || onDevolucion)
  const colSpan = hasActions ? 6 : 5
  const showEmpty = !isLoading && total === 0 && items.length === 0

  return (
    <section className="exhortosTableWrap" aria-live="polite" aria-busy={isLoading}>
      <header className="exhortosTable__header">
        <div className="exhortosTable__headerMain">
          <h3 className="exhortosTable__title">
            Resultado de la búsqueda
            <span className="exhortosTable__count">
              {' '}
              · {isLoading ? 'actualizando…' : `${total} ${total === 1 ? 'registro' : 'registros'}`}
            </span>
          </h3>
          {appliedFilterLabels.length > 0 ? (
            <div className="exhortosTable__filters" aria-label="Filtros aplicados">
              {appliedFilterLabels.map((label) => (
                <span key={label} className="exhortosTable__filterChip">
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {onExport && total > 0 ? (
          <button
            type="button"
            className="exhortosTable__export"
            disabled={isExporting}
            onClick={onExport}
          >
            <svg viewBox="0 0 16 16" aria-hidden>
              <path
                fill="currentColor"
                d="M8.5 1.5v7.7l2.2-2.2 1.1 1.1L8 12.2 4.2 8.1l1.1-1.1 2.2 2.2V1.5h1Zm-6 11h11V14h-11v-1.5Z"
              />
            </svg>
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
        ) : null}
      </header>

      {filtersStale ? (
        <p className="exhortosTable__staleFilters" role="status">
          Modificaste los filtros. Pulsa <strong>Buscar</strong> para actualizar los resultados.
        </p>
      ) : null}

      {showEmpty ? (
        <p className="exhortosTable__empty" role="status">
          No se encontraron exhortos con los filtros indicados.
        </p>
      ) : (
        <>
          <div
            className={`exhortosTableScroll${isLoading ? ' exhortosTableScroll--loading' : ''}`}
          >
            <table className="exhortosTable">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="exhortosTable__th">
                      <IconFilter />
                      CARÁTULA
                    </span>
                  </th>
                  <th scope="col">FACULTADES</th>
                  <th scope="col">
                    <span className="exhortosTable__th">
                      <IconUser />
                      Abogado
                    </span>
                  </th>
                  <th scope="col">
                    <span className="exhortosTable__th">
                      <IconBuilding />
                      Ciudad Exhorto
                    </span>
                  </th>
                  <th scope="col">
                    <span className="exhortosTable__th">
                      <IconCheck />
                      Estado
                    </span>
                  </th>
                  {hasActions ? (
                    <th scope="col" className="exhortosTable__thActions">
                      <span className="sr-only">Acciones</span>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={colSpan} className="exhortosTable__loadingCell">
                      Cargando resultados…
                    </td>
                  </tr>
                ) : (
                  items.map((row, index) => {
                    const busy = actionBusyId === row.id

                    return (
                      <tr key={row.id ?? `row-${page}-${index}`}>
                        <td data-label="Carátula">
                          <CaratulaCell
                            nombreCliente={row.nombreCliente}
                            apellidoDeudor={row.apellidoDeudor}
                          />
                        </td>
                        <td className="exhortosTable__facultades" data-label="Facultades">
                          {displayText(row.facultades).toUpperCase()}
                        </td>
                        <td data-label="Abogado">{displayText(row.abogado).toUpperCase()}</td>
                        <td data-label="Ciudad">{displayText(row.ciudad).toUpperCase()}</td>
                        <td data-label="Estado">
                          <EstadoBadge estado={row.estado} />
                        </td>
                        {hasActions ? (
                          <td className="exhortosTable__actions" data-label="Acciones">
                            {onHonorario && !row.tieneBoletaHonorario ? (
                              <button
                                type="button"
                                className="exhortosTable__action exhortosTable__action--honorario"
                                aria-label={`Ingresar boleta honorario ${row.rolJuicio ?? ''}`}
                                title="Ingresar boleta honorario"
                                disabled={busy || !row.id}
                                onClick={() => onHonorario(row)}
                              >
                                <svg viewBox="0 0 16 16" aria-hidden>
                                  <path
                                    fill="currentColor"
                                    d="M13.5 2.5 6 10 2.5 6.5 1 8l5 5 9-9-1.5-1.5Z"
                                  />
                                </svg>
                              </button>
                            ) : null}
                            {onDevolucion && !row.tieneBoletaDevolucion ? (
                              <button
                                type="button"
                                className="exhortosTable__action exhortosTable__action--devolucion"
                                aria-label={`Ingresar devolución ${row.rolJuicio ?? ''}`}
                                title="Ingresar devolución"
                                disabled={busy || !row.id}
                                onClick={() => onDevolucion(row)}
                              >
                                <svg viewBox="0 0 16 16" aria-hidden>
                                  <path
                                    fill="currentColor"
                                    d="M13.5 2.5 6 10 2.5 6.5 1 8l5 5 9-9-1.5-1.5Z"
                                  />
                                </svg>
                              </button>
                            ) : null}
                            {onEdit ? (
                              <button
                                type="button"
                                className="exhortosTable__action exhortosTable__action--edit"
                                aria-label={`Editar exhorto ${row.rolJuicio ?? ''}`}
                                title="Editar"
                                disabled={busy || !row.id}
                                onClick={() => onEdit(row)}
                              >
                                <svg viewBox="0 0 16 16" aria-hidden>
                                  <path
                                    fill="currentColor"
                                    d="M12.1 2.5a1.4 1.4 0 0 1 2 2L5.2 13.4l-3.6.8.8-3.6L12.1 2.5Z"
                                  />
                                </svg>
                              </button>
                            ) : null}
                            {onDelete ? (
                              <button
                                type="button"
                                className="exhortosTable__action exhortosTable__action--delete"
                                aria-label={`Eliminar exhorto ${row.rolJuicio ?? ''}`}
                                title="Eliminar"
                                disabled={busy || !row.id}
                                onClick={() => onDelete(row)}
                              >
                                <svg viewBox="0 0 16 16" aria-hidden>
                                  <path
                                    fill="currentColor"
                                    d="M3 4h10l-.8 9.2a1 1 0 0 1-1 .8H4.8a1 1 0 0 1-1-.8L3 4Zm2-1V2h6v1h4v1H1V3h4ZM6 6v6h1V6H6Zm3 0v6h1V6H9Z"
                                  />
                                </svg>
                              </button>
                            ) : null}
                          </td>
                        ) : null}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <nav className="exhortosPagination" aria-label="Paginación de resultados">
            <p className="exhortosPagination__info">
              {isLoading
                ? 'Actualizando resultados…'
                : total > 0
                  ? `Mostrando ${from}–${to} de ${total}`
                  : 'Sin resultados'}
            </p>
            <div className="exhortosPagination__controls">
              <button
                type="button"
                className="exhortosPagination__btn"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
              >
                Anterior
              </button>
              <span className="exhortosPagination__pages">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="exhortosPagination__btn"
                disabled={page >= totalPages || isLoading || total === 0}
                onClick={() => onPageChange(page + 1)}
              >
                Siguiente
              </button>
            </div>
          </nav>
        </>
      )}
    </section>
  )
}
