module.exports = function (input) {
  if (typeof input === 'string') input = JSON.parse(input)

  const { vars } = input.head
  const results = input.results.bindings

  if (vars.length === 1) {
    const varName = vars[0]
    return results
    .map(result => parseValue(result[varName]))
    // filtering-out bnodes
    .filter(result => result != null)
  }

  const { richVars, standaloneVars } = identifyVars(vars)
  return results.map(getSimplifiedResult(richVars, standaloneVars))
}

const parseValue = function (valueObj) {
  if (!(valueObj)) return
  var { datatype } = valueObj
  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '')
  const parser = parsers[valueObj.type] || getDatatypesParsers(datatype)
  return parser(valueObj)
}

const parsers = {
  uri: valueObj => parseUri(valueObj.value),
  // blank nodes will be filtered-out in order to get things simple
  bnode: () => null
}

const numberParser = valueObj => parseFloat(valueObj.value)

const getDatatypesParsers = function (datatype) {
  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '')
  return datatypesParsers[datatype] || passValue
}

const datatypesParsers = {
  decimal: numberParser,
  integer: numberParser,
  float: numberParser,
  double: numberParser,
  boolean: valueObj => valueObj.value === 'true'
}

// return the raw value if the datatype is missing
const passValue = valueObj => valueObj.value

const parseUri = function (uri) {
  if (uri.startsWith('http://www.wikidata.org/entity/statement/')) {
    return convertStatementUriToGuid(uri)
  }

  return uri
  .replace('http://www.wikidata.org/entity/', '')
  .replace('http://www.wikidata.org/prop/direct/', '')
}

const convertStatementUriToGuid = function (uri) {
  uri = uri.replace('http://www.wikidata.org/entity/statement/', '')
  const parts = uri.split('-')
  return parts[0] + '$' + parts.slice(1).join('-')
}

const identifyVars = function (vars) {
  const data = { richVars: [], standaloneVars: [] }
  return vars.reduce(spreadVars(vars), data)
}

const spreadVars = vars => (data, varName) => {
  if (vars.some(isAssociatedVar(varName))) {
    data.richVars.push(varName)
    return data
  }

  if (!associatedVarPattern.test(varName)) {
    data.standaloneVars.push(varName)
    return data
  }

  let associatedVar = varName
    .replace(associatedVarPattern, '$1')
    // The pattern regex fails to capture AltLabel prefixes alone,
    // due to the comflict with Label
    .replace(/Alt$/, '')

  if (!vars.includes(associatedVar)) {
    data.standaloneVars.push(varName)
  }

  return data
}

const associatedVarPattern = /^(\w+)(Label|Description|AltLabel)$/

const isAssociatedVar = varNameA => varNameB => {
  if (`${varNameA}Label` === varNameB) return true
  if (`${varNameA}Description` === varNameB) return true
  if (`${varNameA}AltLabel` === varNameB) return true
  return false
}

const getSimplifiedResult = function (richVars, standaloneVars) {
  return function (result) {
    const simplifiedResult = {}
    for (let varName of richVars) {
      let value = parseValue(result[varName])
      if (value != null) {
        simplifiedResult[varName] = { value }
        addAssociatedValue(result, varName, 'label', simplifiedResult[varName])
        addAssociatedValue(result, varName, 'description', simplifiedResult[varName])
        addAssociatedValue(result, varName, 'aliases', simplifiedResult[varName])
      }
    }
    for (let varName of standaloneVars) {
      simplifiedResult[varName] = parseValue(result[varName])
    }
    return simplifiedResult
  }
}

const addAssociatedValue = (result, varName, associatedVarName, varData) => {
  const fullAssociatedVarName = varName + varNameSuffixMap[associatedVarName]
  const fullAssociatedVarData = result[fullAssociatedVarName]
  if (fullAssociatedVarData != null) {
    varData[associatedVarName] = fullAssociatedVarData.value
  }
}

const varNameSuffixMap = {
  label: 'Label',
  description: 'Description',
  aliases: 'AltLabel'
}
