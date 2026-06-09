import './DashBrandLogo.css'

const LOGO_SRC = '/logo-tramitacion-exhortos.png'

/** Marca del sidebar (mismo logo PNG que el login). */
export function DashBrandLogo() {
  return (
    <div className="dashBrandLogo">
      <div className="dashBrandLogo__logoWrap">
        <img
          className="dashBrandLogo__logo"
          src={LOGO_SRC}
          width="76"
          height="76"
          alt=""
          decoding="async"
        />
      </div>
      <p className="dashBrandLogo__text">
        Tramitación Exhortos
        <span className="dashBrandLogo__sub">A &amp; G Asociados</span>
      </p>
    </div>
  )
}
