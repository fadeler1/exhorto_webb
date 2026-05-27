import { USER_PERFIL } from '../auth/userPerfil.js'

/**
 * @typedef {{
 *   id: string
 *   label: string
 *   path?: string
 *   children?: AppNavItem[]
 * }} AppNavItem
 */

/** @type {AppNavItem[]} */
const NAV_TODO = [
  { id: 'home', label: 'HOME', path: '/home' },
  {
    id: 'exhorto',
    label: 'EXHORTO',
    path: '/dashboard',
    children: [
      { id: 'ingresar', label: 'INGRESAR EXHORTO', path: '/exhortos/ingresar' },
    ],
  },
  {
    id: 'honorarios',
    label: 'HONORARIOS',
    children: [
      {
        id: 'honorarios-revisar',
        label: 'REVISAR HONORARIOS',
        path: '/honorarios/revisar',
      },
    ],
  },
  {
    id: 'admin',
    label: 'ADMIN USUARIOS',
    children: [
      { id: 'admin-usuarios', label: 'VER USUARIOS', path: '/admin/usuarios' },
    ],
  },
  {
    id: 'respaldo',
    label: 'RESPALDO',
    children: [
      {
        id: 'respaldo-exhortos',
        label: 'RESPALDO EXHORTOS',
        path: '/admin/respaldo-exhortos',
      },
    ],
  },
]

/** @type {AppNavItem[]} */
const NAV_INGRESAR = [
  { id: 'home', label: 'HOME', path: '/home' },
  {
    id: 'exhorto',
    label: 'EXHORTO',
    path: '/dashboard',
    children: [
      { id: 'ingresar', label: 'INGRESAR EXHORTO', path: '/exhortos/ingresar' },
    ],
  },
]

/** @type {AppNavItem[]} */
const NAV_DEFAULT = [
  {
    id: 'exhorto',
    label: 'EXHORTO',
    path: '/dashboard',
  },
]

/**
 * @param {AppNavItem[]} items
 * @returns {AppNavItem[]}
 */
function flattenNavItems(items) {
  /** @type {AppNavItem[]} */
  const flat = []
  for (const item of items) {
    if (item.path) flat.push(item)
    if (item.children?.length) flat.push(...flattenNavItems(item.children))
  }
  return flat
}

/**
 * Menú lateral según perfil (alineado al sistema legado).
 * @param {string | null | undefined} perfil
 * @returns {AppNavItem[]}
 */
export function getAppNavItems(perfil) {
  if (perfil === USER_PERFIL.TODO) return NAV_TODO
  if (perfil === USER_PERFIL.INGRESAR) return NAV_INGRESAR
  return NAV_DEFAULT
}

/**
 * Ruta por defecto tras login según perfil.
 * @param {string | null | undefined} perfil
 */
export function getDefaultRouteForPerfil(perfil) {
  if (perfil === USER_PERFIL.INGRESAR || perfil === USER_PERFIL.TODO) return '/home'
  return '/dashboard'
}

/**
 * @param {string | null | undefined} perfil
 * @param {string} path
 */
export function isPathAllowedForPerfil(perfil, path) {
  const flat = flattenNavItems(getAppNavItems(perfil))
  if (flat.some((item) => path === item.path || path.startsWith(`${item.path}/`))) {
    return true
  }
  if (path.startsWith('/exhortos/') && path.endsWith('/diligencias')) {
    return flat.some((item) => item.id === 'exhorto' || item.id === 'ingresar')
  }
  return false
}

/**
 * @param {string} pathname
 * @param {AppNavItem[]} items
 */
export function getActiveNavId(pathname, items) {
  const flat = flattenNavItems(items)
  const match = flat
    .filter((item) => item.path)
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))
    .find(
      (item) =>
        pathname === item.path || pathname.startsWith(`${item.path}/`),
    )
  if (match) return match.id

  if (pathname.startsWith('/exhortos/') && pathname.endsWith('/diligencias')) {
    return 'exhorto'
  }
  return 'home'
}

/**
 * @param {string} activeNavId
 * @param {AppNavItem} navItem
 */
export function isNavSectionActive(activeNavId, navItem) {
  if (!navItem.children?.length) return false
  if (activeNavId === navItem.id) return true
  return navItem.children.some((child) => child.id === activeNavId)
}

/**
 * @param {string} activeNavId
 * @param {AppNavItem[]} items
 */
export function isExhortoSectionActive(activeNavId, items) {
  const exhorto = items.find((item) => item.id === 'exhorto')
  if (!exhorto) return false
  return isNavSectionActive(activeNavId, exhorto)
}
