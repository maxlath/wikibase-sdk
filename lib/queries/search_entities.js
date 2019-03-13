const buildUrl = require('../utils/build_url')
const { isPlainObject } = require('../utils/utils')
const types = [ 'item', 'property', 'lexeme', 'form', 'sense' ]

module.exports = function (search, language, limit, format, uselang) {
  var type

  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(search)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    const params = search
    search = params.search
    language = params.language
    limit = params.limit
    format = params.format
    uselang = params.uselang
    type = params.type
  }

  if (!(search && search.length > 0)) throw new Error("search can't be empty")

  language = language || 'en'
  uselang = uselang || language
  limit = limit || '20'
  format = format || 'json'
  type = type || 'item'

  if (!types.includes(type)) throw new Error(`invalid type: ${type}`)

  return buildUrl({
    action: 'wbsearchentities',
    search: search,
    language: language,
    limit: limit,
    format: format,
    uselang: uselang,
    type: type
  })
}
