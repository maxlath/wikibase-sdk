const helpers = require('../helpers/helpers')
const sparqlQuery = require('./sparql_query')

module.exports = function (property, value, limit = 1000) {
  if (helpers.isWikidataEntityId(value)) {
    value = `wd:${value}`
  } else if (typeof value === 'string') {
    value = `\`${value}\``
  }

  const sparql = `
    SELECT ?subject WHERE {
      ?subject wdt:${property} ${value} .
    }
    LIMIT ${limit}
    `

  return sparqlQuery(sparql)
}
