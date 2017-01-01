module.exports = function (sparql) {
  const query = encodeURIComponent(sparql)
  return `https://query.wikidata.org/sparql?format=json&query=${query}`
}
