const { isPlainObject } = require('../utils/utils')

module.exports = buildUrl => params => {
  if (!isPlainObject(params)) {
    throw new Error(`expected parameters to be passed as an object, got ${params} (${typeof params})`)
  }

  const { search, statement, format = 'json', limit, offset } = params
  let { namespace } = params

  if (!(search || statement)) throw new Error('missing "search" or "statement" parameter')

  let srsearch = ''
  if (search) srsearch += search

  if (statement) {
    const statements = statement instanceof Array ? statement : [ statement ]
    for (const singleStatement of statements) {
      srsearch += ` haswbstatement:${singleStatement}`
    }
  }

  if (namespace instanceof Array) {
    namespace = namespace.join('|')
  }

  return buildUrl({
    action: 'query',
    list: 'search',
    srsearch: srsearch.trim(),
    format,
    srnamespace: namespace,
    srlimit: limit,
    sroffset: offset,
  })
}
