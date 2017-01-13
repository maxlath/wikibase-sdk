module.exports = function (input) {
  if (typeof input === 'string') input = JSON.parse(input)

  const { vars } = input.head
  const results = input.results.bindings

  if (vars.length === 1) {
    const varName = vars[0]
    return results
    .map((result) => parseValue(result[varName]))
    // filtering-out bnodes
    .filter((result) => result != null)
  } else {
    const [ varsWithLabel, varsWithout ] = identifyVars(vars)
    return results.map(getSimplifiedResult(varsWithLabel, varsWithout))
  }
}

const parseValue = function (valueObj) {
  if (!(valueObj)) return
  var { datatype } = valueObj
  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '')
  const parser = parsers[valueObj.type] || getDatatypesParsers(datatype)
  return parser(valueObj)
}

const parsers = {
  uri: (valueObj) => parseUri(valueObj.value),
  // blank nodes will be filtered-out in order to get things simple
  bnode: () => null
}

const numberParser = (valueObj) => parseFloat(valueObj.value)

const getDatatypesParsers = function (datatype) {
  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '')
  return datatypesParsers[datatype] || passValue
}

const datatypesParsers = {
  decimal: numberParser,
  integer: numberParser,
  float: numberParser,
  double: numberParser,
  boolean: (valueObj) => valueObj.value === 'true'
}

// return the raw value if the datatype is missing
const passValue = (valueObj) => valueObj.value

const parseUri = (uri) => uri.replace('http://www.wikidata.org/entity/', '')

const identifyVars = function (vars) {
  const varsWithLabel = []
  const varsWithoutLabel = []

  for (let varName of vars) {
    if (vars.indexOf(`${varName}Label`) > -1) {
      varsWithLabel.push(varName)
    } else if (!(/^\w+Label$/.test(varName))) {
      varsWithoutLabel.push(varName)
    }
    // letting aside `${varName}Label` vars
    // as they will simply be embedded in varName results
  }

  return [ varsWithLabel, varsWithoutLabel ]
}

const getSimplifiedResult = function (varsWithLabel, varsWithout) {
  return function (result) {
    const simplifiedResult = {}
    for (let varName of varsWithLabel) {
      let value = parseValue(result[varName])
      if (value != null) {
        let label = result[`${varName}Label`] && result[`${varName}Label`].value
        simplifiedResult[varName] = { value, label }
      }
    }
    for (let varName of varsWithout) {
      simplifiedResult[varName] = parseValue(result[varName])
    }
    return simplifiedResult
  }
}
