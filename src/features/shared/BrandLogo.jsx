import './BrandLogo.css'

const LOGO_SRC = '/logo-tramitacion-exhortos.png'

/** Logo oficial A&G Exhortos (balanza + texto). */
export function BrandLogo({ className = '' }) {
  return (
    <img
      className={`brandLogo ${className}`.trim()}
      src={LOGO_SRC}
      width="120"
      alt="A&amp;G Exhortos"
      decoding="async"
    />
  )
}
