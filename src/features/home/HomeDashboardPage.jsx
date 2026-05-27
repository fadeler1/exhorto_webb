import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchExhortoDashboardStats,
  parseDashboardStats,
} from '../../api/exhortosApi.js'
import { useAuthDependencies } from '../../auth/AuthDependenciesProvider.jsx'
import { aggregatePorRegion } from '../../utils/chileRegions.js'
import { fixLegacyEncoding } from '../../utils/fixLegacyEncoding.js'
import { AppShell } from '../layout/AppShell.jsx'
import { AttributeStatPanel } from './components/AttributeStatPanel.jsx'
import { ChileRegionMap } from './components/ChileRegionMap.jsx'
import './HomeDashboardPage.css'

/**
 * @param {string | null | undefined} value
 */
function display(value) {
  return fixLegacyEncoding((value ?? '').trim())
}

export function HomeDashboardPage() {
  const navigate = useNavigate()
  const { apiClient, clearSession } = useAuthDependencies()
  const [stats, setStats] = useState(
    /** @type {import('../../api/exhortosApi.js').ExhortoDashboardStats | null} */ (null),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const regionData = useMemo(
    () => (stats ? aggregatePorRegion(stats.porCiudad) : []),
    [stats],
  )

  const loadStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchExhortoDashboardStats(apiClient)
      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(result.message)
        setStats(null)
        return
      }
      setStats(parseDashboardStats(result.data))
    } catch {
      setError('No se pudieron cargar las estadísticas.')
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }, [apiClient, clearSession, navigate])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  const resumen = stats?.resumen ?? { total: 0, vigente: 0, terminado: 0 }

  return (
    <AppShell activeNav="home">
      <div className="dashMain__inner homeDash">
        <header className="homeDash__head">
          <div>
            <h1 className="homeDash__title">Panel de exhortos</h1>
            <p className="homeDash__subtitle">
              Resumen de exhortos ingresados, vigentes y terminados
            </p>
          </div>
          <button
            type="button"
            className="homeDash__refresh"
            onClick={() => void loadStats()}
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </header>

        {error ? (
          <p className="homeDash__error" role="alert">
            {error}
          </p>
        ) : null}

        <section className="homeDash__cards" aria-label="Resumen general">
          <article className="homeDash__card homeDash__card--total">
            <p className="homeDash__cardLabel">Total ingresados</p>
            <p className="homeDash__cardValue">{resumen.total}</p>
          </article>
          <article className="homeDash__card homeDash__card--vigente">
            <p className="homeDash__cardLabel">Vigentes</p>
            <p className="homeDash__cardValue">{resumen.vigente}</p>
          </article>
          <article className="homeDash__card homeDash__card--terminado">
            <p className="homeDash__cardLabel">Terminados</p>
            <p className="homeDash__cardValue">{resumen.terminado}</p>
          </article>
        </section>

        <div className="homeDash__mapWrap">
          <ChileRegionMap regions={regionData} />
        </div>

        <section className="homeDash__statsGrid" aria-label="Estadísticas por atributo">
          <AttributeStatPanel title="Por ciudad" items={stats?.porCiudad ?? []} />
          <AttributeStatPanel title="Por abogado" items={stats?.porAbogado ?? []} />
          <AttributeStatPanel title="Por tribunal" items={stats?.porTribunal ?? []} />
          <AttributeStatPanel title="Por facultades" items={stats?.porFacultades ?? []} />
        </section>

        <section className="homeDash__recent" aria-labelledby="home-recent-title">
          <h2 id="home-recent-title" className="homeDash__recentTitle">
            Últimos exhortos ingresados
          </h2>
          {isLoading && !stats ? (
            <p className="homeDash__loading">Cargando…</p>
          ) : null}
          {!isLoading && (stats?.recientes.length ?? 0) === 0 ? (
            <p className="homeDash__loading">No hay exhortos registrados.</p>
          ) : (
            <div className="homeDash__tableWrap">
              <table className="homeDash__table">
                <thead>
                  <tr>
                    <th scope="col">Carátula</th>
                    <th scope="col">Ciudad</th>
                    <th scope="col">Abogado</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="sr-only">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recientes ?? []).map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span className="homeDash__cliente">{display(row.nombreCliente)}</span>
                        <span className="homeDash__con"> CON </span>
                        <span>{display(row.apellidoDeudor)}</span>
                      </td>
                      <td>{display(row.ciudad)}</td>
                      <td>{display(row.abogado)}</td>
                      <td>
                        <span
                          className={`homeDash__badge ${
                            row.estado === 0
                              ? 'homeDash__badge--terminado'
                              : 'homeDash__badge--vigente'
                          }`}
                        >
                          {row.estado === 0 ? 'TERMINADO' : 'VIGENTE'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="homeDash__linkBtn"
                          onClick={() => navigate(`/exhortos/${row.id}/diligencias`)}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
