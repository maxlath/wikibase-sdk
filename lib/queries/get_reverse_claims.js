const helpers = require('../helpers/helpers')
const sparqlQuery = require('./sparql_query')
// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
const itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } '

module.exports = function (property, value, options = {}) {
  var { limit, caseInsensitive, keepProperties } = options
  limit = limit || 1000
  const sparqlFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery
  const valueString = getValueString(value)
  const filter = keepProperties ? '' : itemsOnly
  const sparql = sparqlFn(property, valueString, filter, limit)
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

function directValueQuery (property, value, filter, limit) {
  return `SELECT ?subject WHERE {
      ?subject wdt:${property} ${value} .
      ${filter}
    }
    LIMIT ${limit}`
}

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
function caseInsensitiveValueQuery (property, value, filter, limit) {
  return `SELECT ?subject WHERE {
    ?subject wdt:${property} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}
  }
  LIMIT ${limit}`
}
