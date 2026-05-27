import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthDependenciesProvider } from '../auth/AuthDependenciesProvider.jsx'
import { AdminUsuariosPage } from '../features/admin/AdminUsuariosPage.jsx'
import { DashboardPage } from '../features/dashboard/DashboardPage.jsx'
import { HonorariosPage } from '../features/honorarios/HonorariosPage.jsx'
import { RevisarHonorariosPage } from '../features/honorarios/RevisarHonorariosPage.jsx'
import { HomeDashboardPage } from '../features/home/HomeDashboardPage.jsx'
import { ExhortoDiligenciasPage } from '../features/exhortos/ExhortoDiligenciasPage.jsx'
import { IngresarExhortoPage } from '../features/exhortos/IngresarExhortoPage.jsx'
import { LoginPage } from '../features/login/LoginPage.jsx'
import { RespaldoExhortosPage } from '../features/respaldo/RespaldoExhortosPage.jsx'
import { RequireCanIngresarExhorto } from './RequireCanIngresarExhorto.jsx'
import { RequirePerfilRoute } from './RequirePerfilRoute.jsx'
import { RequireAuth } from './RequireAuth.jsx'
import { PerfilDefaultRedirect } from './PerfilDefaultRedirect.jsx'
import { RequireTodoPerfil } from './RequireTodoPerfil.jsx'

function AuthenticatedRoutes() {
  return (
    <RequirePerfilRoute>
      <Routes>
        <Route path="/home" element={<HomeDashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/exhortos/ingresar"
          element={
            <RequireCanIngresarExhorto>
              <IngresarExhortoPage />
            </RequireCanIngresarExhorto>
          }
        />
        <Route path="/exhortos/:exhortoId/diligencias" element={<ExhortoDiligenciasPage />} />
        <Route
          path="/honorarios"
          element={
            <RequireTodoPerfil>
              <HonorariosPage />
            </RequireTodoPerfil>
          }
        />
        <Route
          path="/honorarios/revisar"
          element={
            <RequireTodoPerfil>
              <RevisarHonorariosPage />
            </RequireTodoPerfil>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RequireTodoPerfil>
              <AdminUsuariosPage />
            </RequireTodoPerfil>
          }
        />
        <Route
          path="/admin/respaldo-exhortos"
          element={
            <RequireTodoPerfil>
              <RespaldoExhortosPage />
            </RequireTodoPerfil>
          }
        />
        <Route path="*" element={<PerfilDefaultRedirect />} />
      </Routes>
    </RequirePerfilRoute>
  )
}

export default function App() {
  return (
    <AuthDependenciesProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AuthenticatedRoutes />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthDependenciesProvider>
  )
}
