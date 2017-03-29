const { fixedEncodeURIComponent } = require('../utils/utils')

module.exports = function (sparql) {
  const query = fixedEncodeURIComponent(sparql)
  return `https://query.wikidata.org/sparql?format=json&query=${query}`
}
