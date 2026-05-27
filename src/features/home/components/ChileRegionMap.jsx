import { useMemo, useState } from 'react'
import { CHILE_REGIONS } from '../../../utils/chileRegions.js'
import './ChileRegionMap.css'

/**
 * @param {number} value
 * @param {number} max
 */
function heatColor(value, max) {
  if (value <= 0 || max <= 0) return '#e8ecf4'
  const t = Math.min(1, value / max)
  const r = Math.round(13 + (235 - 13) * t)
  const g = Math.round(33 + (94 - 33) * t)
  const b = Math.round(66 + (40 - 66) * t)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * @param {{
 *   regions: Array<{
 *     code: string
 *     name: string
 *     path?: string
 *     total: number
 *     vigente: number
 *     terminado: number
 *   }>
 * }} props
 */
export function ChileRegionMap({ regions }) {
  const [hovered, setHovered] = useState(/** @type {string | null} */ (null))

  const mapRegions = useMemo(() => {
    const byCode = Object.fromEntries(regions.map((r) => [r.code, r]))
    return CHILE_REGIONS.map((base) => {
      const data = byCode[base.code]
      return {
        ...base,
        total: data?.total ?? 0,
        vigente: data?.vigente ?? 0,
        terminado: data?.terminado ?? 0,
      }
    })
  }, [regions])

  const extra = regions.find((r) => r.code === 'CL-XX')
  const maxTotal = Math.max(1, ...mapRegions.map((r) => r.total), extra?.total ?? 0)
  const active =
    hovered != null
      ? mapRegions.find((r) => r.code === hovered) ?? extra
      : null

  return (
    <section className="regionMap" aria-label="Mapa regional de exhortos">
      <h3 className="regionMap__title">Distribución regional (por ciudad)</h3>
      <div className="regionMap__layout">
        <svg
          className="regionMap__svg"
          viewBox="0 0 200 480"
          role="img"
          aria-label="Mapa esquemático de Chile por región"
        >
          {mapRegions.map((region) => (
            <path
              key={region.code}
              d={region.path}
              className={`regionMap__region${hovered === region.code ? ' regionMap__region--active' : ''}`}
              fill={heatColor(region.total, maxTotal)}
              stroke="#fff"
              strokeWidth="1.5"
              onMouseEnter={() => setHovered(region.code)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(region.code)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <title>
                {region.name}: {region.total} exhortos
              </title>
            </path>
          ))}
        </svg>

        <div className="regionMap__side">
          {active ? (
            <div className="regionMap__tooltip">
              <p className="regionMap__tooltipName">{active.name}</p>
              <p className="regionMap__tooltipTotal">{active.total} exhortos</p>
              <p className="regionMap__tooltipMeta">
                Vigente: {active.vigente} · Terminado: {active.terminado}
              </p>
            </div>
          ) : (
            <p className="regionMap__hint">Pasa el cursor sobre una región para ver el detalle.</p>
          )}

          <div className="regionMap__legend" aria-hidden>
            <span>Bajo</span>
            <div className="regionMap__legendBar" />
            <span>Alto</span>
          </div>

          <ul className="regionMap__top">
            {[...mapRegions]
              .filter((r) => r.total > 0)
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((r) => (
                <li key={r.code}>
                  <span>{r.name}</span>
                  <strong>{r.total}</strong>
                </li>
              ))}
          </ul>

          {extra && extra.total > 0 ? (
            <p className="regionMap__other">
              Otras ciudades sin clasificar: <strong>{extra.total}</strong>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
