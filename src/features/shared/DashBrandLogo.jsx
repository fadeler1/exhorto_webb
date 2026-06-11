import { BrandLogo } from './BrandLogo.jsx'
import './DashBrandLogo.css'

/** Marca del sidebar (balanza + texto). */
export function DashBrandLogo() {
  return (
    <div className="dashBrandLogo">
      <div className="dashBrandLogo__logoWrap">
        <BrandLogo className="dashBrandLogo__logo" />
      </div>
      <p className="dashBrandLogo__text">
        Tramitación Exhortos
        <span className="dashBrandLogo__sub">A &amp; G Asociados</span>
      </p>
    </div>
  )
}
