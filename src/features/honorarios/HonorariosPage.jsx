import { Navigate } from 'react-router-dom'

/** Redirige la ruta legacy `/honorarios` al submenú de revisión. */
export function HonorariosPage() {
  return <Navigate to="/honorarios/revisar" replace />
}
