/**
 * Corrige texto con mojibake típico (UTF-8 leído como Latin-1): "25Â°" → "25°", "doÃ±a" → "doña".
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function fixLegacyEncoding(value) {
  if (value == null || typeof value !== 'string') return ''
  if (!/[ÃÂ]/.test(value)) return value
  try {
    const bytes = new Uint8Array(value.length)
    for (let i = 0; i < value.length; i += 1) {
      bytes[i] = value.charCodeAt(i) & 0xff
    }
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}
