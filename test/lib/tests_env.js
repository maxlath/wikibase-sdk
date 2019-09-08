const instance = 'https://www.wikidata.org'

module.exports = {
  instance,
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
  buildUrl: require('../../lib/utils/build_url')(instance)
}
