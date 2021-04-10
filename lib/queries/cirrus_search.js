// See https://www.wikidata.org/w/api.php?action=help&modules=query%2Bsearch

const { isPlainObject } = require('../utils/utils')
const namespacePattern = /^\d+[|\d]*$/

module.exports = buildUrl => params => {
  if (!isPlainObject(params)) {
    throw new Error(`expected parameters to be passed as an object, got ${params} (${typeof params})`)
  }

  const { search, haswbstatement, format = 'json', limit, offset, profile, sort } = params
  let { namespace } = params

  if (!(search || haswbstatement)) throw new Error('missing "search" or "haswbstatement" parameter')

  let srsearch = ''
  if (search) srsearch += search

  if (haswbstatement) {
    const statements = haswbstatement instanceof Array ? haswbstatement : [ haswbstatement ]
    for (const statement of statements) {
      if (statement[0] === '-') srsearch += ` -haswbstatement:${statement.slice(1)}`
      else srsearch += ` haswbstatement:${statement}`
    }
  }

  if (limit != null && (typeof limit !== 'number' || limit < 1)) {
    throw new Error(`invalid limit: ${limit}`)
  }

  if (offset != null && (typeof offset !== 'number' || offset < 0)) {
    throw new Error(`invalid offset: ${offset}`)
  }

  if (namespace instanceof Array) namespace = namespace.join('|')
  else if (typeof namespace === 'number') namespace = namespace.toString()

  if (namespace && !namespacePattern.test(namespace)) {
    throw new Error(`invalid namespace: ${namespace}`)
  }

  if (profile != null && typeof profile !== 'string') {
    throw new Error(`invalid profile: ${profile} (${typeof profile}, expected string)`)
  }

  if (sort != null && typeof sort !== 'string') {
    throw new Error(`invalid sort: ${sort} (${typeof sort}, expected string)`)
  }

  return buildUrl({
    action: 'query',
    list: 'search',
    srsearch: srsearch.trim(),
    format,
    srnamespace: namespace,
    srlimit: limit,
    sroffset: offset,
    srqiprofile: profile,
    srsort: sort,
  })
}
