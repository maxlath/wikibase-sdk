// Ex: keep only 'fr' in 'fr_FR'
export const shortLang = language => language.toLowerCase().split('_')[0]

// a polymorphism helper:
// accept either a string or an array and return an array
export const forceArray = array => {
  if (typeof array === 'string') array = [ array ]
  return array || []
}

// simplistic implementation to filter-out arrays
export const isPlainObject = obj => {
  if (!obj || typeof obj !== 'object' || obj instanceof Array) return false
  return true
}

// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
export const fixedEncodeURIComponent = str => {
  return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
}

export const replaceSpaceByUnderscores = str => str.replace(/\s/g, '_')

export const uniq = array => Array.from(new Set(array))

const encodeCharacter = char => '%' + char.charCodeAt(0).toString(16)
