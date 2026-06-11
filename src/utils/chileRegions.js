import { fixLegacyEncoding } from './fixLegacyEncoding.js'

/** Estilo visual alineado al mapa oficial de regiones de Chile. */
export const CHILE_REGION_DISPLAY = {
  'CL-AP': {
    roman: 'XV',
    short: 'Arica y Parinacota',
    label: 'Región de Arica y Parinacota',
    color: '#7a1f32',
  },
  'CL-TA': {
    roman: 'I',
    short: 'Tarapacá',
    label: 'Región de Tarapacá',
    color: '#e31b23',
  },
  'CL-AN': {
    roman: 'II',
    short: 'Antofagasta',
    label: 'Región de Antofagasta',
    color: '#f68b1f',
  },
  'CL-AT': {
    roman: 'III',
    short: 'Atacama',
    label: 'Región de Atacama',
    color: '#ffd200',
  },
  'CL-CO': {
    roman: 'IV',
    short: 'Coquimbo',
    label: 'Región de Coquimbo',
    color: '#8dc63f',
  },
  'CL-VS': {
    roman: 'V',
    short: 'Valparaíso',
    label: 'Región de Valparaíso',
    color: '#b71c2c',
  },
  'CL-RM': {
    roman: 'RM',
    short: 'Metropolitana',
    label: 'Región Metropolitana de Santiago',
    color: '#ed1c24',
  },
  'CL-LI': {
    roman: 'VI',
    short: "O'Higgins",
    label: "Región del Libertador Bernardo O'Higgins",
    color: '#f15a24',
  },
  'CL-ML': {
    roman: 'VII',
    short: 'Maule',
    label: 'Región del Maule',
    color: '#ffdd00',
  },
  'CL-NB': {
    roman: 'XVI',
    short: 'Ñuble',
    label: 'Región de Ñuble',
    color: '#39b54a',
  },
  'CL-BI': {
    roman: 'VIII',
    short: 'Biobío',
    label: 'Región del Bío-Bío',
    color: '#006838',
  },
  'CL-AR': {
    roman: 'IX',
    short: 'Araucanía',
    label: 'Región de La Araucanía',
    color: '#8b1a2e',
  },
  'CL-LR': {
    roman: 'XIV',
    short: 'Los Ríos',
    label: 'Región de Los Ríos',
    color: '#d91f26',
  },
  'CL-LL': {
    roman: 'X',
    short: 'Los Lagos',
    label: 'Región de Los Lagos',
    color: '#7ac143',
  },
  'CL-AI': {
    roman: 'XI',
    short: 'Aysén',
    label: 'Región de Aysén del General Ibáñez del Campo',
    color: '#f7941d',
  },
  'CL-MA': {
    roman: 'XII',
    short: 'Magallanes',
    label: 'Región de Magallanes y Antártica Chilena',
    color: '#92278f',
  },
}

/** Metadatos regionales (sin geometría; el mapa la carga aparte). */
export const CHILE_REGIONS = Object.entries(CHILE_REGION_DISPLAY).map(([code, meta]) => ({
  code,
  name: meta.short,
  roman: meta.roman,
  shortLabel: `${meta.roman} ${meta.short}`,
  fullLabel: `${meta.roman} ${meta.label}`,
  color: meta.color,
}))

/** @type {Record<string, string>} */
const CIUDAD_TO_REGION = {
  ARICA: 'CL-AP',
  IQUIQUE: 'CL-TA',
  ALTOHOSPICIO: 'CL-TA',
  ANTOFAGASTA: 'CL-AN',
  CALAMA: 'CL-AN',
  COPIAPO: 'CL-AT',
  LASERENA: 'CL-CO',
  COQUIMBO: 'CL-CO',
  VALPARAISO: 'CL-VS',
  'VINA DEL MAR': 'CL-VS',
  VINADELMAR: 'CL-VS',
  QUILPUE: 'CL-VS',
  SANTIAGO: 'CL-RM',
  'SAN BERNARDO': 'CL-RM',
  MAIPU: 'CL-RM',
  RANCAGUA: 'CL-LI',
  SANFERNANDO: 'CL-LI',
  TALCA: 'CL-ML',
  CURICO: 'CL-ML',
  LINARES: 'CL-ML',
  CHILLAN: 'CL-NB',
  CONCEPCION: 'CL-BI',
  TALCAHUANO: 'CL-BI',
  LOSANGELES: 'CL-BI',
  TEMUCO: 'CL-AR',
  VALDIVIA: 'CL-LR',
  OSORNO: 'CL-LL',
  PUERTOMONTT: 'CL-LL',
  CASTRO: 'CL-LL',
  COYHAIQUE: 'CL-AI',
  PUNTAARENAS: 'CL-MA',
}

/**
 * @param {string | null | undefined} ciudad
 */
export function normalizeCiudadKey(ciudad) {
  const text = fixLegacyEncoding((ciudad ?? '').trim())
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
}

/**
 * @param {string | null | undefined} ciudad
 */
export function ciudadToRegionCode(ciudad) {
  const key = normalizeCiudadKey(ciudad)
  if (!key) return 'CL-XX'
  if (CIUDAD_TO_REGION[key]) return CIUDAD_TO_REGION[key]

  for (const [city, code] of Object.entries(CIUDAD_TO_REGION)) {
    if (key.includes(city) || city.includes(key)) return code
  }

  if (key.includes('CONCEPCION')) return 'CL-BI'
  if (key.includes('SANTIAGO')) return 'CL-RM'
  if (key.includes('VALPARAISO') || key.includes('VINA')) return 'CL-VS'
  if (key.includes('ANTOFAGASTA')) return 'CL-AN'
  if (key.includes('TEMUCO')) return 'CL-AR'
  if (key.includes('PUERTO MONTT') || key.includes('PUERTOMONTT')) return 'CL-LL'

  return 'CL-XX'
}

/**
 * @param {import('../api/exhortosApi.js').ExhortoAttributeStat[]} porCiudad
 */
export function aggregatePorRegion(porCiudad) {
  /** @type {Record<string, { total: number, vigente: number, terminado: number }>} */
  const acc = {}

  for (const item of porCiudad) {
    const code = ciudadToRegionCode(item.nombre)
    if (!acc[code]) {
      acc[code] = { total: 0, vigente: 0, terminado: 0 }
    }
    acc[code].total += item.total
    acc[code].vigente += item.vigente
    acc[code].terminado += item.terminado
  }

  return CHILE_REGIONS.map((region) => ({
    ...region,
    total: acc[region.code]?.total ?? 0,
    vigente: acc[region.code]?.vigente ?? 0,
    terminado: acc[region.code]?.terminado ?? 0,
  })).concat(
    acc['CL-XX']?.total
      ? [
          {
            code: 'CL-XX',
            name: 'Otras / sin clasificar',
            paths: [],
            labelX: 0,
            labelY: 0,
            total: acc['CL-XX'].total,
            vigente: acc['CL-XX'].vigente,
            terminado: acc['CL-XX'].terminado,
          },
        ]
      : [],
  )
}
