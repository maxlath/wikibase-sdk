module.exports = {
  // Ex: keep only 'fr' in 'fr_FR'
  shortLang: language => language.toLowerCase().split(/[^a-z]/)[0],

  // a polymorphism helper:
  // accept either a string or an array and return an array
  forceArray: function (array) {
    if (typeof array === 'string') array = [ array ]
    return array || []
  },

  // simplistic implementation to filter-out arrays
  isPlainObject: function (obj) {
    if (!obj || typeof obj !== 'object' || obj instanceof Array) return false
    return true
  },

  // encodeURIComponent ignores !, ', (, ), and *
  // cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
  fixedEncodeURIComponent: function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
  },

  replaceSpaceByUnderscores: str => str.replace(/\s/g, '_'),

  uniq: array => Array.from(new Set(array))
}

const encodeCharacter = char => '%' + char.charCodeAt(0).toString(16)
