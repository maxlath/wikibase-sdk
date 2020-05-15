const instance = 'https://www.wikidata.org'
const instanceApiEndpoint = `${instance}/w/api.php`

module.exports = {
  instance,
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
  buildUrl: require('../../lib/utils/build_url')(instanceApiEndpoint)
}
