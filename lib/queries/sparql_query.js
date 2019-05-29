const { fixedEncodeURIComponent } = require('../utils/utils')

module.exports = sparql => {
  const query = fixedEncodeURIComponent(sparql)
  return `https://query.wikidata.org/sparql?format=json&query=${query}`
}
