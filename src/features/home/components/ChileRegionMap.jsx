import { useEffect, useMemo, useState } from 'react'
import { CHILE_REGIONS } from '../../../utils/chileRegions.js'
import './ChileRegionMap.css'

const LABEL_GAP = 28
const LABEL_NAME_WIDTH = 148
const LABEL_COUNT_WIDTH = 44
const LABEL_PAD_RIGHT = 20

/**
 * @param {{
 *   regions: Array<{
 *     code: string
 *     name: string
 *     total: number
 *     vigente: number
 *     terminado: number
 *   }>
 * }} props
 */
export function ChileRegionMap({ regions }) {
  const [hoveredCode, setHoveredCode] = useState(/** @type {string | null} */ (null))
  const [selectedCode, setSelectedCode] = useState(/** @type {string | null} */ (null))
  const [mapAssets, setMapAssets] = useState(
    /** @type {{
     *   viewBox: { x: number, y: number, width: number, height: number }
     *   geometry: Array<{ code: string, paths: string[], labelX: number, labelY: number }>
     * } | null} */ (null),
  )

  useEffect(() => {
    let cancelled = false
    import('../../../utils/chileRegionPaths.generated.js').then((mod) => {
      if (cancelled) return
      setMapAssets({
        viewBox: mod.CHILE_MAP_VIEWBOX,
        geometry: mod.CHILE_REGION_GEOMETRY,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const mapRegions = useMemo(() => {
    const byCode = Object.fromEntries(regions.map((r) => [r.code, r]))
    const geometryByCode = Object.fromEntries(
      (mapAssets?.geometry ?? []).map((g) => [g.code, g]),
    )

    return CHILE_REGIONS.map((base) => {
      const data = byCode[base.code]
      const shape = geometryByCode[base.code]
      return {
        ...base,
        paths: shape?.paths ?? [],
        markerX: shape?.labelX ?? 0,
        markerY: shape?.labelY ?? 0,
        total: data?.total ?? 0,
        vigente: data?.vigente ?? 0,
        terminado: data?.terminado ?? 0,
      }
    })
  }, [regions, mapAssets])

  const extra = regions.find((r) => r.code === 'CL-XX')
  const totalExhortos = mapRegions.reduce((sum, r) => sum + r.total, 0) + (extra?.total ?? 0)
  const regionsWithData = mapRegions.filter((r) => r.total > 0).length

  const activeCode = selectedCode ?? hoveredCode
  const active =
    activeCode != null
      ? mapRegions.find((r) => r.code === activeCode) ?? extra
      : null

  const topRegions = useMemo(
    () =>
      [...mapRegions]
        .filter((r) => r.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 6),
    [mapRegions],
  )

  function selectRegion(code) {
    setSelectedCode((prev) => (prev === code ? null : code))
  }

  const mapViewBox = mapAssets?.viewBox ?? { x: 0, y: 0, width: 280, height: 880 }
  const mapRight = mapViewBox.x + mapViewBox.width
  const labelX = mapRight + LABEL_GAP
  const countX = labelX + LABEL_NAME_WIDTH + LABEL_COUNT_WIDTH
  const labelsWidth = LABEL_GAP + LABEL_NAME_WIDTH + LABEL_COUNT_WIDTH + LABEL_PAD_RIGHT
  const extendedViewBox = {
    x: mapViewBox.x,
    y: mapViewBox.y,
    width: mapViewBox.width + labelsWidth,
    height: mapViewBox.height,
  }
  const svgViewBox = `${extendedViewBox.x} ${extendedViewBox.y} ${extendedViewBox.width} ${extendedViewBox.height}`

  return (
    <section className="regionMap" aria-label="Mapa regional de exhortos">
      <header className="regionMap__head">
        <div>
          <h3 className="regionMap__title">Mapa de Chile · exhortos por región</h3>
          <p className="regionMap__subtitle">
            Distribución según ciudad del expediente · {regionsWithData} regiones con registros
          </p>
        </div>
        <div className="regionMap__summary">
          <span className="regionMap__summaryValue">{totalExhortos}</span>
          <span className="regionMap__summaryLabel">Total mapeado</span>
        </div>
      </header>

      <div className="regionMap__layout">
        <div className="regionMap__mapPanel">
          <svg
            className="regionMap__svg"
            viewBox={svgViewBox}
            preserveAspectRatio="xMinYMid meet"
            role="img"
            aria-label="Mapa de Chile por región"
          >
            <rect
              className="regionMap__bg"
              x={extendedViewBox.x}
              y={extendedViewBox.y}
              width={extendedViewBox.width}
              height={extendedViewBox.height}
              fill="#ffffff"
            />

            {!mapAssets ? (
              <text
                x={mapViewBox.x + mapViewBox.width / 2}
                y={mapViewBox.y + mapViewBox.height / 2}
                className="regionMap__loading"
                textAnchor="middle"
              >
                Cargando mapa…
              </text>
            ) : (
              <>
                <g className="regionMap__callouts" aria-hidden="true">
                  {mapRegions.map((region) => (
                    <line
                      key={`line-${region.code}`}
                      className="regionMap__leader"
                      x1={region.markerX}
                      y1={region.markerY}
                      x2={labelX}
                      y2={region.markerY}
                    />
                  ))}
                </g>

                <g className="regionMap__regions">
                  {mapRegions.map((region) => {
                    const isActive = activeCode === region.code
                    const isSelected = selectedCode === region.code
                    const hasData = region.total > 0
                    return (
                      <g
                        key={region.code}
                        className={`regionMap__regionGroup${isActive ? ' regionMap__regionGroup--active' : ''}${isSelected ? ' regionMap__regionGroup--selected' : ''}${hasData ? ' regionMap__regionGroup--hasData' : ''}`}
                        onMouseEnter={() => setHoveredCode(region.code)}
                        onMouseLeave={() => setHoveredCode(null)}
                        onClick={() => selectRegion(region.code)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            selectRegion(region.code)
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${region.fullLabel}: ${region.total} exhortos`}
                      >
                        {region.paths.map((d, i) => (
                          <path
                            key={i}
                            d={d}
                            className="regionMap__region"
                            fill={region.color}
                            stroke="#ffffff"
                            strokeWidth={isActive ? 2 : 1.2}
                            strokeLinejoin="round"
                            pointerEvents="visiblePainted"
                          />
                        ))}
                        <circle
                          className="regionMap__marker"
                          cx={region.markerX}
                          cy={region.markerY}
                          r={isActive ? 5 : 4}
                        />
                      </g>
                    )
                  })}
                </g>

                <g className="regionMap__callouts">
                  {mapRegions.map((region) => {
                    const isActive = activeCode === region.code
                    return (
                      <g key={`label-${region.code}`}>
                        <text
                          x={labelX}
                          y={region.markerY}
                          className={`regionMap__label${isActive ? ' regionMap__label--active' : ''}`}
                          dominantBaseline="middle"
                        >
                          {region.shortLabel}
                        </text>
                        <text
                          x={countX}
                          y={region.markerY}
                          className={`regionMap__labelCount${isActive ? ' regionMap__labelCount--active' : ''}${region.total > 0 ? '' : ' regionMap__labelCount--zero'}`}
                          textAnchor="end"
                          dominantBaseline="middle"
                        >
                          {region.total}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </>
            )}
          </svg>
        </div>

        <div className="regionMap__side">
          {active ? (
            <div className="regionMap__tooltip">
              <p className="regionMap__tooltipName">
                {'fullLabel' in active && active.fullLabel ? active.fullLabel : active.name}
              </p>
              <p className="regionMap__tooltipTotal">{active.total} exhortos</p>
              <div className="regionMap__tooltipBars">
                <div className="regionMap__tooltipBar">
                  <span>Vigentes</span>
                  <strong>{active.vigente}</strong>
                </div>
                <div className="regionMap__tooltipBar regionMap__tooltipBar--muted">
                  <span>Terminados</span>
                  <strong>{active.terminado}</strong>
                </div>
              </div>
            </div>
          ) : (
            <p className="regionMap__hint">
              Seleccione una región en el mapa para ver vigentes y terminados.
            </p>
          )}

          <h4 className="regionMap__topTitle">Regiones con más exhortos</h4>
          <ul className="regionMap__top">
            {topRegions.length > 0 ? (
              topRegions.map((r) => (
                <li key={r.code}>
                  <button
                    type="button"
                    className={`regionMap__topBtn${selectedCode === r.code ? ' regionMap__topBtn--active' : ''}`}
                    onClick={() => selectRegion(r.code)}
                  >
                    <span>{r.roman} · {r.name}</span>
                    <strong>{r.total}</strong>
                  </button>
                </li>
              ))
            ) : (
              <li className="regionMap__topEmpty">Sin datos por región todavía.</li>
            )}
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
