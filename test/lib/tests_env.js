const instance = 'https://www.wikidata.org'
const sparqlEndpoint = 'https://query.wikidata.org/sparql'

module.exports = {
  instance,
  sparqlEndpoint,
  buildUrl: require('../../lib/utils/build_url')(instance)
}
