const { forceArray } = require('../utils/utils')
const { isItemId } = require('../helpers/helpers')
const validate = require('../helpers/validate')

// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
const itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } '

module.exports = sparqlEndpoint => {
  const sparqlQuery = require('./sparql_query')(sparqlEndpoint)
  return (property, value, options = {}) => {
    const { limit, caseInsensitive, keepProperties } = options
    const valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery
    const filter = keepProperties ? '' : itemsOnly

    // Allow to request values for several properties at once
    let properties = forceArray(property)
    properties.forEach(validate.propertyId)
    properties = properties.map(prefixifyProperty).join('|')

    const valueBlock = getValueBlock(value, valueFn, properties, filter)
    let sparql = `SELECT DISTINCT ?subject WHERE { ${valueBlock} }`
    if (limit) sparql += ` LIMIT ${limit}`
    return sparqlQuery(sparql)
  }
}

const getValueBlock = (value, valueFn, properties, filter) => {
  if (!(value instanceof Array)) {
    return valueFn(properties, getValueString(value), filter)
  }

  const valuesBlocks = value
    .map(getValueString)
    .map(valStr => valueFn(properties, valStr, filter))

  return '{ ' + valuesBlocks.join('} UNION {') + ' }'
}

const getValueString = value => {
  if (isItemId(value)) {
    value = `wd:${value}`
  } else if (typeof value === 'string') {
    value = `'${value}'`
  }
  return value
}

const directValueQuery = (properties, value, filter, limit) => {
  return `?subject ${properties} ${value} .
    ${filter}`
}

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
const caseInsensitiveValueQuery = (properties, value, filter, limit) => {
  return `?subject ${properties} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}`
}

const prefixifyProperty = property => 'wdt:' + property
