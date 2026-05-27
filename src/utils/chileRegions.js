import { fixLegacyEncoding } from './fixLegacyEncoding.js'

/** @type {{ code: string, name: string, path: string }[]} */
export const CHILE_REGIONS = [
  {
    code: 'CL-AP',
    name: 'Arica y Parinacota',
    path: 'M72 8h56v28H72z',
  },
  {
    code: 'CL-TA',
    name: 'Tarapacá',
    path: 'M72 38h56v28H72z',
  },
  {
    code: 'CL-AN',
    name: 'Antofagasta',
    path: 'M76 68h48v32H76z',
  },
  {
    code: 'CL-AT',
    name: 'Atacama',
    path: 'M80 102h40v28H80z',
  },
  {
    code: 'CL-CO',
    name: 'Coquimbo',
    path: 'M84 132h32v26H84z',
  },
  {
    code: 'CL-VS',
    name: 'Valparaíso',
    path: 'M70 160h60v24H70z',
  },
  {
    code: 'CL-RM',
    name: 'Metropolitana',
    path: 'M88 186h24v22H88z',
  },
  {
    code: 'CL-LI',
    name: "O'Higgins",
    path: 'M86 210h28v24H86z',
  },
  {
    code: 'CL-ML',
    name: 'Maule',
    path: 'M84 236h32v26H84z',
  },
  {
    code: 'CL-NB',
    name: 'Ñuble',
    path: 'M86 264h28v22H86z',
  },
  {
    code: 'CL-BI',
    name: 'Biobío',
    path: 'M82 288h36v28H82z',
  },
  {
    code: 'CL-AR',
    name: 'Araucanía',
    path: 'M84 318h32v26H84z',
  },
  {
    code: 'CL-LR',
    name: 'Los Ríos',
    path: 'M80 346h40v24H80z',
  },
  {
    code: 'CL-LL',
    name: 'Los Lagos',
    path: 'M76 372h48v28H76z',
  },
  {
    code: 'CL-AI',
    name: 'Aysén',
    path: 'M78 402h44v30H78z',
  },
  {
    code: 'CL-MA',
    name: 'Magallanes',
    path: 'M74 434h52v34H74z',
  },
]

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
            path: '',
            total: acc['CL-XX'].total,
            vigente: acc['CL-XX'].vigente,
            terminado: acc['CL-XX'].terminado,
          },
        ]
      : [],
  )
}
