import { fixLegacyEncoding } from '../../../utils/fixLegacyEncoding.js'
import './AttributeStatPanel.css'

/**
 * @param {string | null | undefined} value
 */
function label(value) {
  return fixLegacyEncoding((value ?? '').trim()) || 'Sin dato'
}

/**
 * @param {{
 *   title: string
 *   items: import('../../../api/exhortosApi.js').ExhortoAttributeStat[]
 *   maxItems?: number
 * }} props
 */
export function AttributeStatPanel({ title, items, maxItems = 8 }) {
  const slice = items.slice(0, maxItems)
  const maxTotal = Math.max(1, ...slice.map((i) => i.total))

  return (
    <section className="attrStat" aria-label={title}>
      <h3 className="attrStat__title">{title}</h3>
      {slice.length === 0 ? (
        <p className="attrStat__empty">Sin datos</p>
      ) : (
        <ul className="attrStat__list">
          {slice.map((item) => {
            const pct = Math.round((item.total / maxTotal) * 100)
            return (
              <li key={`${title}-${item.nombre}`} className="attrStat__item">
                <div className="attrStat__row">
                  <span className="attrStat__name" title={label(item.nombre)}>
                    {label(item.nombre)}
                  </span>
                  <span className="attrStat__count">{item.total}</span>
                </div>
                <div className="attrStat__barTrack" aria-hidden>
                  <div
                    className="attrStat__barFill"
                    style={{ width: `${(item.total / maxTotal) * 100}%` }}
                  >
                    {item.vigente > 0 ? (
                      <span
                        className="attrStat__bar attrStat__bar--vigente"
                        style={{ flex: item.vigente }}
                      />
                    ) : null}
                    {item.terminado > 0 ? (
                      <span
                        className="attrStat__bar attrStat__bar--terminado"
                        style={{ flex: item.terminado }}
                      />
                    ) : null}
                  </div>
                </div>
                <p className="attrStat__meta">
                  <span className="attrStat__dot attrStat__dot--vigente" />
                  Vigente {item.vigente}
                  <span className="attrStat__sep">·</span>
                  <span className="attrStat__dot attrStat__dot--terminado" />
                  Terminado {item.terminado}
                  <span className="attrStat__sep">·</span>
                  {pct}% del máximo
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
