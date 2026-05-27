import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import { getPerfilLabel, isPerfilAdmin } from '../../../api/usersApi.js'
import './UsuariosTable.css'

/**
 * @param {string | null | undefined} value
 */
function displayText(value) {
  return fixLegacyEncoding((value ?? '').trim()) || '—'
}

function IconUser() {
  return (
    <svg className="usuariosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z"
      />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg className="usuariosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-7Zm1.2-.5 4.8 3.6L12.8 4H3.2Zm9.3 1.4L8.5 9.4 3.5 5.4v6.1h9V5.4Z"
      />
    </svg>
  )
}

function IconId() {
  return (
    <svg className="usuariosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V14l-5-2.5L3 14V2.5Z"
      />
    </svg>
  )
}

function IconPerfil() {
  return (
    <svg className="usuariosTable__thIcon" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M11.5 1.5 14.5 4.5 5.8 13.2 2.8 14.2l1-3 8.7-8.7Zm1.4-.9 1 1-1.3 1.3-1-1 1.3-1.3Z"
      />
    </svg>
  )
}

/**
 * @param {{
 *   items: import('../../../api/usersApi.js').UserListItem[]
 *   isLoading?: boolean
 *   actionBusyId?: string | null
 *   onEdit?: (user: import('../../../api/usersApi.js').UserListItem) => void
 *   onDelete?: (user: import('../../../api/usersApi.js').UserListItem) => void
 * }} props
 */
export function UsuariosTable({
  items,
  isLoading = false,
  actionBusyId = null,
  onEdit,
  onDelete,
}) {
  return (
    <section className="usuariosTableWrap" aria-live="polite" aria-busy={isLoading}>
      <header className="usuariosTable__sectionHead">
        <h3 className="usuariosTable__sectionTitle">Listado de usuarios</h3>
      </header>

      {items.length === 0 && !isLoading ? (
        <p className="usuariosTable__empty" role="status">
          No hay usuarios registrados en el sistema.
        </p>
      ) : (
        <div className="usuariosTableScroll">
          <table className="usuariosTable">
            <thead>
              <tr>
                <th scope="col">
                  <span className="usuariosTable__th">
                    <IconUser />
                    Usuario
                  </span>
                </th>
                <th scope="col">
                  <span className="usuariosTable__th">
                    <IconEmail />
                    Email
                  </span>
                </th>
                <th scope="col">
                  <span className="usuariosTable__th">
                    <IconId />
                    ID-Logic
                  </span>
                </th>
                <th scope="col">
                  <span className="usuariosTable__th">
                    <IconPerfil />
                    Perfil
                  </span>
                </th>
                <th scope="col" className="usuariosTable__thActions">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && isLoading ? (
                <tr>
                  <td colSpan={5} className="usuariosTable__loadingCell">
                    Cargando usuarios…
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const busy = actionBusyId === row.id
                  const admin = isPerfilAdmin(row.perfil)

                  return (
                    <tr key={row.id}>
                      <td className="usuariosTable__nombre">
                        {displayText(row.nombre)}
                      </td>
                      <td>{displayText(row.email)}</td>
                      <td className="usuariosTable__login">{displayText(row.login)}</td>
                      <td>
                        <span
                          className={`usuariosTable__badge ${
                            admin
                              ? 'usuariosTable__badge--admin'
                              : 'usuariosTable__badge--ingresador'
                          }`}
                        >
                          {getPerfilLabel(row.perfil)}
                        </span>
                      </td>
                      <td className="usuariosTable__actions">
                        <button
                          type="button"
                          className="usuariosTable__action usuariosTable__action--edit"
                          title="Modificar"
                          aria-label={`Modificar ${row.nombre}`}
                          disabled={busy || !onEdit}
                          onClick={() => onEdit?.(row)}
                        >
                          <svg viewBox="0 0 16 16" aria-hidden>
                            <path
                              fill="currentColor"
                              d="M11.5 1.5 14.5 4.5 5.8 13.2 2.8 14.2l1-3 8.7-8.7Zm1.4-.9 1 1-1.3 1.3-1-1 1.3-1.3Z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="usuariosTable__action usuariosTable__action--delete"
                          title="Eliminar"
                          aria-label={`Eliminar ${row.nombre}`}
                          disabled={busy || !onDelete}
                          onClick={() => onDelete?.(row)}
                        >
                          <svg viewBox="0 0 16 16" aria-hidden>
                            <path
                              fill="currentColor"
                              d="M5.5 1.5h5l.5 1.5h4v1.5H2V3h4l.5-1.5ZM3.5 6h1v7.5h1V6h1v7.5h1V6h1v7.5h1V6h1v7.5h1V6h1v7.5h1.5V5H3.5v9.5Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
