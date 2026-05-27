import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUser,
  deleteUser,
  fetchUsers,
  parseUsersListResponse,
  updateUser,
} from '../../api/usersApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { AppShell } from '../layout/AppShell.jsx'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { UsuarioModal } from './components/UsuarioModal.jsx'
import { UsuariosTable } from './components/UsuariosTable.jsx'
import '../dashboard/DashboardPage.css'
import './AdminUsuariosPage.css'

/**
 * Administración de usuarios (perfil TODO).
 */
export function AdminUsuariosPage() {
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const [users, setUsers] = useState(
    /** @type {import('../../api/usersApi.js').UserListItem[]} */ ([]),
  )
  const [loadError, setLoadError] = useState(/** @type {string | null} */ (null))
  const [actionError, setActionError] = useState(/** @type {string | null} */ (null))
  const [isLoading, setIsLoading] = useState(true)
  const [actionBusyId, setActionBusyId] = useState(/** @type {string | null} */ (null))
  const [modalMode, setModalMode] = useState(/** @type {'create' | 'edit' | null} */ (null))
  const [editUser, setEditUser] = useState(
    /** @type {import('../../api/usersApi.js').UserListItem | null} */ (null),
  )
  const [deleteUserTarget, setDeleteUserTarget] = useState(
    /** @type {import('../../api/usersApi.js').UserListItem | null} */ (null),
  )
  const [modalError, setModalError] = useState(/** @type {string | null} */ (null))
  const [isSavingModal, setIsSavingModal] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoadError(null)
    setIsLoading(true)
    try {
      const result = await fetchUsers(apiClient)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setLoadError(result.message)
        setUsers([])
        return
      }
      setUsers(parseUsersListResponse(result))
    } catch {
      setLoadError('No se pudieron cargar los usuarios.')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [apiClient, clearSession, navigate])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  function handleOpenCreate() {
    setModalError(null)
    setEditUser(null)
    setModalMode('create')
  }

  function handleEdit(user) {
    setModalError(null)
    setEditUser(user)
    setModalMode('edit')
  }

  function handleCloseModal() {
    if (isSavingModal) return
    setModalMode(null)
    setEditUser(null)
    setModalError(null)
  }

  async function handleSaveUser(payload) {
    setModalError(null)
    setIsSavingModal(true)
    try {
      const result =
        modalMode === 'create'
          ? await createUser(apiClient, payload)
          : await updateUser(apiClient, editUser?.id ?? '', payload)

      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setModalError(result.message)
        return
      }

      setModalMode(null)
      setEditUser(null)
      await loadUsers()
    } catch {
      setModalError(
        modalMode === 'create'
          ? 'No se pudo crear el usuario.'
          : 'No se pudo modificar el usuario.',
      )
    } finally {
      setIsSavingModal(false)
    }
  }

  function handleDelete(user) {
    if (!user.id) return
    setActionError(null)
    setDeleteUserTarget(user)
  }

  function handleCancelDelete() {
    if (actionBusyId) return
    setDeleteUserTarget(null)
  }

  async function handleConfirmDelete() {
    if (!deleteUserTarget?.id) return
    setActionError(null)
    setActionBusyId(deleteUserTarget.id)
    try {
      const result = await deleteUser(apiClient, deleteUserTarget.id)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setActionError(result.message)
        return
      }
      setDeleteUserTarget(null)
      await loadUsers()
    } catch {
      setActionError('No se pudo eliminar el usuario.')
    } finally {
      setActionBusyId(null)
    }
  }

  return (
    <AppShell activeNav="admin-usuarios">
      <div className="dashMain__inner proModule">
        <header className="proPageHead">
          <h1 className="proPageHead__title">Usuarios del sistema</h1>
          <p className="proPageHead__lead">
            Administre las cuentas, perfiles y accesos del equipo del estudio.
          </p>
        </header>

        <section className="proPanel" aria-label="Listado de usuarios">
          <div className="proPanel__body">
            <div className="proPanel__toolbar">
              <p className="proPanel__toolbarLead">
                Usuarios registrados en la plataforma de tramitación de exhortos.
              </p>
              <button
                type="button"
                className="proPanel__btnPrimary"
                onClick={handleOpenCreate}
              >
                <span className="proPanel__btnPrimaryIcon" aria-hidden>
                  +
                </span>
                Agregar usuario
              </button>
            </div>

          {loadError ? (
            <p
              className="dashForm__feedback dashForm__feedback--error proForm__feedback"
              role="alert"
            >
              {loadError}
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

          <UsuariosTable
            items={users}
            isLoading={isLoading}
            actionBusyId={actionBusyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          </div>
        </section>

        <UsuarioModal
          key={modalMode === 'edit' ? `edit-${editUser?.id}` : 'create'}
          isOpen={modalMode != null}
          mode={modalMode === 'edit' ? 'edit' : 'create'}
          user={editUser}
          onClose={handleCloseModal}
          isSaving={isSavingModal}
          error={modalError}
          onSave={handleSaveUser}
        />

        <ConfirmDialog
          isOpen={deleteUserTarget != null}
          title="Eliminar usuario"
          message="Esta acción quitará el acceso del usuario a la plataforma."
          detail={
            deleteUserTarget
              ? `${deleteUserTarget.nombre} · ${deleteUserTarget.login}`
              : ''
          }
          isBusy={actionBusyId === deleteUserTarget?.id}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  )
}
