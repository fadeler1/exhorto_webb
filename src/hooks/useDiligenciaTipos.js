import { useEffect, useState } from 'react'
import { fetchDiligenciaTipos } from '../api/catalogApi.js'

/**
 * Catálogo diligencia_tipos para filtros y formularios.
 * @param {ReturnType<import('../api/apiClient.js').createApiClient>} apiClient
 */
export function useDiligenciaTipos(apiClient) {
  const [diligenciaTipos, setDiligenciaTipos] = useState(
    /** @type {import('../api/catalogApi.js').DiligenciaTipo[]} */ ([]),
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    void (async () => {
      const result = await fetchDiligenciaTipos(apiClient)
      if (cancelled) return
      if (!result.ok) {
        setDiligenciaTipos([])
        setIsLoading(false)
        return
      }
      const sorted = [...result.items]
        .filter((t) => t.activo !== false)
        .sort((a, b) => {
          const oa = typeof a.orden === 'number' ? a.orden : Number.parseInt(a.codigo, 10)
          const ob = typeof b.orden === 'number' ? b.orden : Number.parseInt(b.codigo, 10)
          if (!Number.isNaN(oa) && !Number.isNaN(ob) && oa !== ob) return oa - ob
          return a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
        })
      setDiligenciaTipos(sorted)
      setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [apiClient])

  return { diligenciaTipos, isLoading }
}
