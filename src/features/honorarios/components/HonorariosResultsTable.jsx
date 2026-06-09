import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './HonorariosResultsTable.css'

const BOLETA_ESTADO_PAGADO = 1
const BOLETA_TIPO_HONORARIO = 1
const EXHORTO_TERMINADO = 0

/**
 * @param {string | null | undefined} value
 */
function displayText(value) {
  return fixLegacyEncoding((value ?? '').trim()) || '—'
}

/**
 * @param {{ nombreCliente?: string, apellidoDeudor?: string }} props
 */
function CaratulaCell({ nombreCliente, apellidoDeudor }) {
  const cliente = displayText(nombreCliente)
  const deudor = displayText(apellidoDeudor)
  if (cliente === '—' && deudor === '—') return '—'
  if (cliente === '—') {
    return <span className="honTable__caratulaLine">{deudor}</span>
  }
  if (deudor === '—') {
    return <span className="honTable__caratulaLine">{cliente}</span>
  }
  return (
    <div className="honTable__caratula">
      <span className="honTable__caratulaLine">{cliente}</span>
      <span className="honTable__caratulaCon" aria-hidden>
        CON
      </span>
      <span className="honTable__caratulaLine honTable__caratulaLine--deudor">
        {deudor}
      </span>
    </div>
  )
}

function IconBullhorn() {
  return (
    <svg className="honTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5v2.2L2 10.5v1h12v-1l-1.5-2.3V6A4.5 4.5 0 0 0 8 1.5Zm0 11.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className="honTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z"
      />
    </svg>
  )
}

function IconBookmark() {
  return (
    <svg className="honTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V14l-5-2.5L3 14V2.5Z"
      />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg className="honTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M11.5 1.5 14.5 4.5 5.8 13.2 2.8 14.2l1-3 8.7-8.7Zm1.4-.9 1 1-1.3 1.3-1-1 1.3-1.3Z"
      />
    </svg>
  )
}

function IconActions() {
  return (
    <svg className="honTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-7ZM4 6h8v1H4V6Zm0 2.5h5v1H4v-1Z"
      />
    </svg>
  )
}

function TipoHonorarioIcon() {
  return (
    <svg className="honTable__tipoIcon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 2 5 5h-4V4Zm-8 14V4h2v12H6Zm4 0v-5h2v5h-2Zm4 0v-8h2v8h-2Z"
      />
    </svg>
  )
}

function TipoDevolucionIcon() {
  return (
    <svg className="honTable__tipoIcon honTable__tipoIcon--dev" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
      />
    </svg>
  )
}

function IconEstadoPendiente() {
  return (
    <svg className="honTable__estadoIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 2a.75.75 0 0 1 .75.75v3.5l2.1 1.2-.75 1.3-2.6-1.5V4.25A.75.75 0 0 1 8 3.5Z"
      />
    </svg>
  )
}

function IconEstadoPagado() {
  return (
    <svg className="honTable__estadoIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M13.5 2.5 6 10 2.5 6.5 1 8l5 5 9-9-1.5-1.5Z"
      />
    </svg>
  )
}

function IconEstadoVigente() {
  return (
    <svg className="honTable__estadoIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 2.5a.75.75 0 0 1 .75.75v2.5H11a.75.75 0 0 1 0 1.5H8.75V11a.75.75 0 0 1-1.5 0V7.25H5a.75.75 0 0 1 0-1.5h2.25V5.25A.75.75 0 0 1 8 4.5Z"
      />
    </svg>
  )
}

function IconEstadoTerminado() {
  return (
    <svg className="honTable__estadoIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M6.5 1.5h3l.5 1.5H14v1.5H2V3h4.5l.5-1.5ZM4 5.5h8l-.8 7.2a1 1 0 0 1-1 .8H5.8a1 1 0 0 1-1-.8L4 5.5Z"
      />
    </svg>
  )
}

/**
 * @param {{
 *   kind: 'boleta-pendiente' | 'boleta-pagado' | 'exhorto-vigente' | 'exhorto-terminado'
 *   label: string
 * }} props
 */
function EstadoBadge({ kind, label }) {
  const icon =
    kind === 'boleta-pendiente' ? (
      <IconEstadoPendiente />
    ) : kind === 'boleta-pagado' ? (
      <IconEstadoPagado />
    ) : kind === 'exhorto-vigente' ? (
      <IconEstadoVigente />
    ) : (
      <IconEstadoTerminado />
    )

  return (
    <span className={`honTable__estado honTable__estado--${kind}`}>
      {icon}
      <span className="honTable__estadoLabel">{label}</span>
    </span>
  )
}

/**
 * @param {number} total
 * @param {number} pageSize
 */
export function getHonorariosTotalPages(total, pageSize) {
  if (total <= 0) return 1
  return Math.ceil(total / pageSize)
}

/**
 * @param {{
 *   items: import('../../../api/honorariosApi.js').BoletaHonorarioItem[]
 *   total: number
 *   page: number
 *   pageSize: number
 *   isLoading?: boolean
 *   actionBusyId?: string | null
 *   onPageChange: (page: number) => void
 *   onOpenExhorto?: (exhortoId: string) => void
 *   onEdit?: (row: import('../../../api/honorariosApi.js').BoletaHonorarioItem) => void
 *   onPay?: (row: import('../../../api/honorariosApi.js').BoletaHonorarioItem) => void
 *   onDelete?: (row: import('../../../api/honorariosApi.js').BoletaHonorarioItem) => void
 *   onExport?: () => void
 *   isExporting?: boolean
 * }} props
 */
export function HonorariosResultsTable({
  items,
  total,
  page,
  pageSize,
  isLoading = false,
  isExporting = false,
  actionBusyId = null,
  onPageChange,
  onOpenExhorto,
  onEdit,
  onPay,
  onDelete,
  onExport,
}) {
  const totalPages = getHonorariosTotalPages(total, pageSize)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(page * pageSize, total)

  return (
    <section className="honTableWrap" aria-live="polite" aria-busy={isLoading}>
      <header className="honTable__header">
        <h3 className="honTable__title">
          Resultados
          <span className="honTable__count">
            {' '}
            · {total} {total === 1 ? 'registro' : 'registros'}
          </span>
        </h3>
        {onExport && total > 0 ? (
          <button
            type="button"
            className="honTable__export"
            disabled={isExporting}
            onClick={onExport}
          >
            <span className="honTable__exportIcon" aria-hidden>
              <svg viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  d="M8.5 1.5v7.8l2.2-2.2 1.1 1.1L8 12.4 4.2 8.2l1.1-1.1 2.2 2.2V1.5h1Zm-6 11h11v1.5h-11V12.5Z"
                />
              </svg>
            </span>
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
        ) : null}
      </header>

      {total === 0 && items.length === 0 && !isLoading ? (
        <p className="honTable__empty" role="status">
          No se encontraron boletas con los filtros indicados.
        </p>
      ) : (
        <>
          <div className="honTableScroll">
            <table className="honTable">
              <thead>
                <tr>
                  <th scope="col" className="honTable__colCaratula">
                    <span className="honTable__th">
                      <IconBullhorn />
                      Carátula
                    </span>
                  </th>
                  <th scope="col" className="honTable__colAbogado">
                    <span className="honTable__th">
                      <IconUser />
                      Abogado
                    </span>
                  </th>
                  <th scope="col" className="honTable__colDoc">
                    <span className="honTable__th">
                      <IconBookmark />
                      Nº doc.
                    </span>
                  </th>
                  <th scope="col" className="honTable__colMonto">
                    <span className="honTable__th">
                      <IconBookmark />
                      Monto
                    </span>
                  </th>
                  <th scope="col" className="honTable__colTipo">
                    <span className="honTable__th">
                      <IconBookmark />
                      Tipo
                    </span>
                  </th>
                  <th scope="col" className="honTable__colPertenece">
                    <span className="honTable__th">
                      <IconBookmark />
                      Pertenece
                    </span>
                  </th>
                  <th scope="col" className="honTable__colEstado">
                    <span className="honTable__th">
                      <IconEdit />
                      Boleta
                    </span>
                  </th>
                  <th scope="col" className="honTable__colEstado">
                    <span className="honTable__th">
                      <IconEdit />
                      Exhorto
                    </span>
                  </th>
                  <th scope="col" className="honTable__thActions">
                    <span className="honTable__th">
                      <IconActions />
                      Acciones
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && isLoading ? (
                  <tr>
                    <td colSpan={9} className="honTable__loadingCell">
                      Cargando resultados…
                    </td>
                  </tr>
                ) : (
                  items.map((row) => {
                    const ex = row.exhorto
                    const boletaPagada = row.estado === BOLETA_ESTADO_PAGADO
                    const esHonorario = row.tipo === BOLETA_TIPO_HONORARIO
                    const exhortoTerminado = ex?.estado === EXHORTO_TERMINADO
                    const busy = actionBusyId === row.id
                    const caratula = (
                      <CaratulaCell
                        nombreCliente={ex?.nombreCliente}
                        apellidoDeudor={ex?.apellidoDeudor}
                      />
                    )

                    return (
                      <tr key={row.id}>
                        <td className="honTable__caratulaCell">
                          {onOpenExhorto && row.exhortoId ? (
                            <button
                              type="button"
                              className="honTable__caratulaLink"
                              onClick={() => onOpenExhorto(row.exhortoId)}
                            >
                              {caratula}
                            </button>
                          ) : (
                            caratula
                          )}
                        </td>
                        <td className="honTable__abogado">
                          {displayText(ex?.abogado)}
                        </td>
                        <td className="honTable__doc">{row.documento ?? '—'}</td>
                        <td className="honTable__monto">
                          {typeof row.monto === 'number'
                            ? `$${row.monto.toLocaleString('es-CL')}`
                            : '—'}
                        </td>
                        <td>
                          <span className="honTable__tipo">
                            {esHonorario ? (
                              <TipoHonorarioIcon />
                            ) : (
                              <TipoDevolucionIcon />
                            )}
                            <span>
                              {esHonorario ? 'Honorario' : 'Devolución'}
                            </span>
                          </span>
                        </td>
                        <td className="honTable__pertenece">
                          {displayText(row.pertenece)}
                        </td>
                        <td className="honTable__estadoCell">
                          <EstadoBadge
                            kind={boletaPagada ? 'boleta-pagado' : 'boleta-pendiente'}
                            label={boletaPagada ? 'Pagado' : 'Pendiente'}
                          />
                        </td>
                        <td className="honTable__estadoCell">
                          <EstadoBadge
                            kind={
                              exhortoTerminado ? 'exhorto-terminado' : 'exhorto-vigente'
                            }
                            label={exhortoTerminado ? 'Terminado' : 'Vigente'}
                          />
                        </td>
                        <td className="honTable__actions">
                          <div className="honTable__actionsGroup" role="group" aria-label="Acciones de boleta">
                            <button
                              type="button"
                              className="honTable__action honTable__action--edit"
                              title="Modificar"
                              aria-label="Modificar boleta"
                              disabled={busy || !onEdit}
                              onClick={() => onEdit?.(row)}
                            >
                              <svg viewBox="0 0 16 16" aria-hidden>
                                <path
                                  fill="currentColor"
                                  d="M11.5 1.5 14.5 4.5 5.8 13.2 2.8 14.2l1-3 8.7-8.7Zm1.4-.9 1 1-1.3 1.3-1-1 1.3-1.3Z"
                                />
                              </svg>
                              <span className="honTable__actionLabel">Editar</span>
                            </button>
                            {!boletaPagada ? (
                              <button
                                type="button"
                                className="honTable__action honTable__action--pay"
                                title="Marcar como pagada"
                                aria-label="Pagar boleta"
                                disabled={busy || !onPay}
                                onClick={() => onPay?.(row)}
                              >
                                <svg viewBox="0 0 16 16" aria-hidden>
                                  <path
                                    fill="currentColor"
                                    d="M13.5 2.5 6 10 2.5 6.5 1 8l5 5 9-9-1.5-1.5Z"
                                  />
                                </svg>
                                <span className="honTable__actionLabel">Pagar</span>
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="honTable__action honTable__action--delete"
                              title="Eliminar"
                              aria-label="Eliminar boleta"
                              disabled={busy || !onDelete}
                              onClick={() => onDelete?.(row)}
                            >
                              <svg viewBox="0 0 16 16" aria-hidden>
                                <path
                                  fill="currentColor"
                                  d="M5.5 1.5h5l.5 1.5h4v1.5H2V3h4l.5-1.5ZM3.5 6h1v7.5h1V6h1v7.5h1V6h1v7.5h1V6h1v7.5h1V6h1v7.5h1.5V5H3.5v9.5Z"
                                />
                              </svg>
                              <span className="honTable__actionLabel">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {total > pageSize ? (
            <footer className="honPagination">
              <p className="honPagination__info">
                Mostrando {from}–{to} de {total}
              </p>
              <div className="honPagination__controls">
                <button
                  type="button"
                  className="honPagination__btn"
                  disabled={page <= 1 || isLoading}
                  onClick={() => onPageChange(page - 1)}
                >
                  Anterior
                </button>
                <span className="honPagination__pages">
                  Página {page} de {totalPages}
                </span>
                <button
                  type="button"
                  className="honPagination__btn"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => onPageChange(page + 1)}
                >
                  Siguiente
                </button>
              </div>
            </footer>
          ) : null}
        </>
      )}
    </section>
  )
}
