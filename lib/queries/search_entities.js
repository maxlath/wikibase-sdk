const { isPlainObject } = require('../utils/utils')
const types = [ 'item', 'property', 'lexeme', 'form', 'sense' ]

module.exports = buildUrl => (search, language, limit, format, uselang) => {
  // Using the variable 'offset' instead of 'continue' as the later is a reserved word
  let type, offset

  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(search)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    const params = search
    search = params.search
    language = params.language
    limit = params.limit
    offset = params.continue
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
  offset = offset || '0'

  if (!types.includes(type)) throw new Error(`invalid type: ${type}`)

  return buildUrl({
    action: 'wbsearchentities',
    search,
    language,
    limit,
    continue: offset,
    format,
    uselang,
    type
  })
}
