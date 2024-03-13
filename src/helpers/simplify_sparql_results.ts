import type { SparqlResults, SparqlValueObj, SparqlValueRaw, SparqlValueType } from '../types/sparql.js'

export type SimplifySparqlResultsOptions = {
  readonly minimize?: boolean
}

export function simplifySparqlResults (input: SparqlResults, options: SimplifySparqlResultsOptions = {}) {
  if (typeof input === 'string') {
    input = JSON.parse(input)
  }

  const { vars } = input.head
  const results = input.results.bindings

  if (vars.length === 1 && options.minimize) {
    const varName = vars[0]
    return results
      .map(result => parseValue(result[varName]))
      // filtering-out bnodes
      .filter((result): result is SparqlValueRaw => result != null)
  }

  const { richVars, associatedVars, standaloneVars } = identifyVars(vars)
  return results.map(result => getSimplifiedResult(richVars, associatedVars, standaloneVars, result))
}

function parseValue (valueObj?: SparqlValueObj) {
  // blank nodes will be filtered-out in order to get things simple
  if (!valueObj || valueObj.type === 'bnode') return null

  const { value } = valueObj

  if (valueObj.type === 'uri') return parseUri(value)

  const datatype = (valueObj.datatype || '').replace('http://www.w3.org/2001/XMLSchema#', '')

  if (datatype === 'decimal' || datatype === 'integer' || datatype === 'float' || datatype === 'double') {
    return parseFloat(value)
  }

  if (datatype === 'boolean') {
    return value === 'true'
  }

  // return the raw value if the datatype is missing
  return value
}

function parseUri (uri: string) {
  // ex: http://www.wikidata.org/entity/statement/
  if (uri.match(/http.*\/entity\/statement\//)) {
    return convertStatementUriToGuid(uri)
  }

  return uri
    // ex: http://www.wikidata.org/entity/
    .replace(/^https?:\/\/.*\/entity\//, '')
    // ex: http://www.wikidata.org/prop/direct/
    .replace(/^https?:\/\/.*\/prop\/direct\//, '')
}

function convertStatementUriToGuid (uri: string) {
  // ex: http://www.wikidata.org/entity/statement/
  uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, '')
  const parts = uri.split('-')
  return parts[0] + '$' + parts.slice(1).join('-')
}

function identifyVars (vars: readonly string[]) {
  let richVars = vars.filter(varName => {
    const isAssociatedPattern = new RegExp(`^${varName}[A-Z]\\w+`)
    return vars.some(v => isAssociatedPattern.test(v))
  })
  richVars = richVars.filter(richVar => {
    return !richVars.some(otherRichVar => {
      return richVar !== otherRichVar && richVar.startsWith(otherRichVar)
    })
  })
  const associatedVarPattern = new RegExp(`^(${richVars.join('|')})[A-Z]`)
  const associatedVars = vars.filter(varName => associatedVarPattern.test(varName))
  const standaloneVars = vars.filter(varName => {
    return !richVars.includes(varName) && !associatedVarPattern.test(varName)
  })
  return { richVars, associatedVars, standaloneVars }
}

function getSimplifiedResult (
  richVars: readonly string[],
  associatedVars: readonly string[],
  standaloneVars: readonly string[],
  input: Readonly<Record<string, SparqlValueObj>>,
) {
  const simplifiedResult: Record<string, SparqlValueType> = {}
  for (const varName of richVars) {
    const richVarData: Record<string, SparqlValueRaw> = {}
    const value = parseValue(input[varName])
    if (value != null) richVarData.value = value
    for (const associatedVarName of associatedVars) {
      if (associatedVarName.startsWith(varName)) addAssociatedValue(input, varName, associatedVarName, richVarData)
    }
    if (Object.keys(richVarData).length > 0) simplifiedResult[varName] = richVarData
  }
  for (const varName of standaloneVars) {
    const value = parseValue(input[varName])
    if (value != null) simplifiedResult[varName] = value
  }
  return simplifiedResult
}

function addAssociatedValue (
  input: Readonly<Record<string, SparqlValueObj>>,
  varName: string,
  associatedVarName: string,
  richVarData: Record<string, SparqlValueRaw>,
) {
  // ex: propertyType => Type
  let shortAssociatedVarName = associatedVarName.split(varName)[1]
  // ex: Type => type
  shortAssociatedVarName = shortAssociatedVarName[0].toLowerCase() + shortAssociatedVarName.slice(1)
  // ex: altLabel => aliases
  shortAssociatedVarName = shortAssociatedVarName === 'altLabel' ? 'aliases' : shortAssociatedVarName
  const associatedVarData = input[associatedVarName]
  if (associatedVarData != null) richVarData[shortAssociatedVarName] = associatedVarData.value
}
