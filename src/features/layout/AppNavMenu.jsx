import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getActiveNavId, isNavSectionActive } from '../../navigation/appNav.js'

/**
 * @param {{
 *   items: import('../../navigation/appNav.js').AppNavItem[]
 *   activeNav?: string
 *   onNavigate?: () => void
 * }} props
 */
export function AppNavMenu({ items, activeNav, onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()

  const resolvedActive =
    activeNav ?? getActiveNavId(location.pathname, items)

  const [openSections, setOpenSections] = useState(() => new Set())

  const ensureSectionOpen = useCallback((sectionId) => {
    setOpenSections((prev) => {
      if (prev.has(sectionId)) return prev
      const next = new Set(prev)
      next.add(sectionId)
      return next
    })
  }, [])

  useEffect(() => {
    for (const item of items) {
      if (item.children?.length && isNavSectionActive(resolvedActive, item)) {
        ensureSectionOpen(item.id)
      }
    }
  }, [items, resolvedActive, ensureSectionOpen])

  function go(path) {
    navigate(path)
    onNavigate?.()
  }

  function toggleSection(sectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  return (
    <ul className="dashNav__list">
      {items.map((item) => {
        if (item.children?.length) {
          const sectionActive = isNavSectionActive(resolvedActive, item)
          const isOpen = openSections.has(item.id) || sectionActive

          return (
            <li key={item.id} className="dashNav__group">
              <div className="dashNav__groupHead">
                <button
                  type="button"
                  className={`dashNav__btn dashNav__btn--parent${
                    sectionActive && resolvedActive === item.id
                      ? ' dashNav__btn--active'
                      : ''
                  }${sectionActive ? ' dashNav__btn--sectionActive' : ''}`}
                  onClick={() => {
                    if (item.path) {
                      go(item.path)
                    } else {
                      toggleSection(item.id)
                    }
                  }}
                >
                  {item.label}
                </button>
                <button
                  type="button"
                  className={`dashNav__toggle${isOpen ? ' dashNav__toggle--open' : ''}`}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Ocultar' : 'Mostrar'} submenú ${item.label}`}
                  onClick={() => toggleSection(item.id)}
                >
                  ›
                </button>
              </div>
              {isOpen ? (
                <ul className="dashNav__sublist">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <button
                        type="button"
                        className={`dashNav__btn dashNav__btn--sub${
                          resolvedActive === child.id ? ' dashNav__btn--active' : ''
                        }`}
                        onClick={() => {
                          if (child.path) go(child.path)
                        }}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        }

        return (
          <li key={item.id}>
            <button
              type="button"
              className={`dashNav__btn${
                resolvedActive === item.id ? ' dashNav__btn--active' : ''
              }`}
              onClick={() => {
                if (item.path) go(item.path)
              }}
            >
              {item.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
