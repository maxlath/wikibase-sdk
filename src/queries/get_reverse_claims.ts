import { isItemId } from '../helpers/helpers.js'
import * as validate from '../helpers/validate.js'
import { forceArray } from '../utils/utils.js'
import { sparqlQueryFactory } from './sparql_query.js'
import type { PropertyId } from '../types/entity.js'
import type { Url } from '../types/options.js'

// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
const itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } '

type Value = string | number
type Values = Value | readonly Value[]

export interface GetReverseClaimsOptions {
  properties: PropertyId | readonly PropertyId[]
  values: Values
  limit?: number
  caseInsensitive?: boolean
  keepProperties?: boolean
}

export const getReverseClaimsFactory = (sparqlEndpoint: Url) => {
  const sparqlQuery = sparqlQueryFactory(sparqlEndpoint)
  return function getReverseClaims (options: GetReverseClaimsOptions): Url {
    let { properties } = options
    const { values, limit, caseInsensitive, keepProperties } = options
    const valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery
    const filter = keepProperties ? '' : itemsOnly

    // Allow to request values for several properties at once
    properties = forceArray(properties)
    properties.forEach(o => validate.propertyId(o))

    const valueBlock = getValueBlock(values, valueFn, properties, filter)
    let sparql = `SELECT DISTINCT ?subject WHERE { ${valueBlock} }`
    if (limit) sparql += ` LIMIT ${limit}`
    return sparqlQuery(sparql)
  }
}

const getValueBlock = (values: Values, valueFn: ValueFn, properties: readonly PropertyId[], filter: string) => {
  const propertiesString = properties.map(property => 'wdt:' + property).join('|')

  if (!(values instanceof Array)) {
    return valueFn(propertiesString, getValueString(values), filter)
  }

  const valuesBlocks = values
    .map(getValueString)
    .map(valStr => valueFn(propertiesString, valStr, filter))

  return '{ ' + valuesBlocks.join('} UNION {') + ' }'
}

const getValueString = (value: Value) => {
  if (typeof value === 'string') {
    return isItemId(value) ? `wd:${value}` : `'${value}'`
  }
  return String(value)
}

type ValueFn = (properties: string, value: string, filter: string) => string

const directValueQuery: ValueFn = (properties, value, filter) => {
  return `?subject ${properties} ${value} .
    ${filter}`
}

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
const caseInsensitiveValueQuery: ValueFn = (properties, value, filter) => {
  return `?subject ${properties} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}`
}
