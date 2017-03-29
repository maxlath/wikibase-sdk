const helpers = require('../helpers/helpers')
const sparqlQuery = require('./sparql_query')

module.exports = function (property, value, options = {}) {
  var { limit, caseInsensitive } = options
  limit = limit || 1000
  const sparqlFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery
  const valueString = getValueString(value)
  const sparql = sparqlFn(property, valueString, limit)
  return sparqlQuery(sparql)
}

function getValueString (value) {
  if (helpers.isItemId(value)) {
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

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
function caseInsensitiveValueQuery (property, value, limit) {
  return `SELECT ?subject WHERE {
    ?subject wdt:${property} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
  }
  LIMIT ${limit}`
}
