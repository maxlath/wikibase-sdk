const { fixedEncodeURIComponent } = require('../utils/utils')

module.exports = sparqlEndpoint => sparql => {
  const query = fixedEncodeURIComponent(sparql)
  return `${sparqlEndpoint}?format=json&query=${query}`
}
