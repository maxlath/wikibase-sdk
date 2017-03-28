const helpers = require('../helpers/helpers')
const sparqlQuery = require('./sparql_query')

module.exports = function (property, value, options = {}) {
  const { limit, caseInsensitive } = options
  const sparqlFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery
  return sparqlQuery(sparqlFn(property, getValueString(value), limit))
}

function getValueString (value) {
  if (helpers.isWikidataEntityId(value)) {
    value = `wd:${value}`
  } else if (typeof value === 'string') {
    value = `'${value}'`
  }
  return value
}

function directValueQuery (property, value, limit) {
  return `SELECT ?subject WHERE {
      ?subject wdt:${property} ${value} .
    }
    LIMIT ${limit}`
}

function caseInsensitiveValueQuery (property, value, limit) {
  return `SELECT ?subject WHERE {
    ?subject wdt:${property} ?value .
    FILTER (regex(?value, "${value}", "i"))
  }
  LIMIT ${limit}`
}
