/**
 * Genera paths SVG por región a partir de mapa continental simplificado.
 * Ejecutar: node scripts/generate-chile-map-paths.mjs
 */
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/utils/chileRegionPaths.generated.js')
const SOURCE_URL =
  'https://raw.githubusercontent.com/maxfindel/chile-map-geojson/main/maps/cl-continental.js'

const REGION_ORDER = [
  'CL-AP',
  'CL-TA',
  'CL-AN',
  'CL-AT',
  'CL-CO',
  'CL-VS',
  'CL-RM',
  'CL-LI',
  'CL-ML',
  'CL-NB',
  'CL-BI',
  'CL-AR',
  'CL-LR',
  'CL-LL',
  'CL-AI',
  'CL-MA',
]

const REGION_NAMES = {
  'CL-AP': 'Arica y Parinacota',
  'CL-TA': 'Tarapacá',
  'CL-AN': 'Antofagasta',
  'CL-AT': 'Atacama',
  'CL-CO': 'Coquimbo',
  'CL-VS': 'Valparaíso',
  'CL-RM': 'Región Metropolitana',
  'CL-LI': "O'Higgins",
  'CL-ML': 'Maule',
  'CL-NB': 'Ñuble',
  'CL-BI': 'Biobío',
  'CL-AR': 'Araucanía',
  'CL-LR': 'Los Ríos',
  'CL-LL': 'Los Lagos',
  'CL-AI': 'Aysén',
  'CL-MA': 'Magallanes',
}

const WIDTH = 280
const HEIGHT = 900
const PADDING = 14

/** @param {string} pathD */
function pathPixelBounds(pathD) {
  const nums = pathD.match(/-?\d*\.?\d+/g)?.map(Number) ?? []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i]
    const y = nums[i + 1]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY }
}

/** @param {string | null | undefined} d */
function compactPath(d) {
  if (!d) return []
  return d.split(/(?=M)/).filter(Boolean)
}

/** @param {string[]} paths */
function pathBounds(paths) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const p of paths) {
    const b = pathPixelBounds(p)
    if (b.minX < minX) minX = b.minX
    if (b.maxX > maxX) maxX = b.maxX
    if (b.minY < minY) minY = b.minY
    if (b.maxY > maxY) maxY = b.maxY
  }

  return { minX, maxX, minY, maxY }
}

const res = await fetch(SOURCE_URL)
if (!res.ok) throw new Error(`No se pudo descargar ${SOURCE_URL}`)
const raw = await res.text()
const objectLiteral = raw.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/)?.[1]
if (!objectLiteral) throw new Error('Formato de mapa fuente no reconocido')

/** @type {{ features: import('geojson').Feature[] }} */
const source = new Function(`return ${objectLiteral}`)()

/** @type {Record<string, import('geojson').Feature>} */
const featureByCode = {}

for (const feature of source.features) {
  const hcKey = feature.properties?.['hc-key']
  if (!hcKey) continue
  const code = hcKey.toUpperCase().replace('CL-', 'CL-')
  featureByCode[code] = {
    type: 'Feature',
    properties: {
      code,
      name: REGION_NAMES[code] ?? feature.properties?.name ?? code,
    },
    geometry: feature.geometry,
  }
}

const mergedFeatures = REGION_ORDER.map((code) => featureByCode[code]).filter(Boolean)
if (mergedFeatures.length !== 16) {
  throw new Error(`Se esperaban 16 regiones, se obtuvieron ${mergedFeatures.length}`)
}

const projection = geoNaturalEarth1()
  .center([-71, -38])
  .fitExtent(
    [
      [PADDING, PADDING],
      [WIDTH - PADDING, HEIGHT - PADDING],
    ],
    { type: 'FeatureCollection', features: mergedFeatures },
  )

const pathGen = geoPath(projection).digits(2)

const regions = mergedFeatures.map((feature) => {
  const code = feature.properties?.code
  const d = pathGen(feature)
  const [labelX, labelY] = projection(geoCentroid(feature))
  return {
    code,
    name: feature.properties?.name ?? code,
    paths: compactPath(d),
    labelX: Math.round(labelX * 100) / 100,
    labelY: Math.round(labelY * 100) / 100,
  }
})

const bounds = pathBounds(regions.flatMap((r) => r.paths))
const mapViewBox = {
  x: Math.floor(bounds.minX - PADDING),
  y: Math.floor(bounds.minY - PADDING),
  width: Math.ceil(bounds.maxX - bounds.minX + PADDING * 2),
  height: Math.ceil(bounds.maxY - bounds.minY + PADDING * 2),
}

const file = `/** Generado por scripts/generate-chile-map-paths.mjs — no editar a mano */
/** Datos cartográficos: maxfindel/chile-map-geojson (CC0-1.0) */

export const CHILE_MAP_VIEWBOX = ${JSON.stringify(mapViewBox)}

export const CHILE_REGION_GEOMETRY = ${JSON.stringify(regions, null, 2)}
`

fs.writeFileSync(OUT, file)
const sizeKb = Math.round(fs.statSync(OUT).size / 1024)
console.log(`Escrito ${OUT} (${regions.length} regiones, ${sizeKb} KB)`)
console.log('viewBox', mapViewBox)
