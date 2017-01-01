module.exports = {
  // languages have to be 2-letters language codes
  shortLang: (language) => language.slice(0, 2),

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
  }
}
