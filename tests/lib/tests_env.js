const instance = 'https://www.wikidata.org'
const wgScriptPath = 'w'
const instanceApiEndpoint = `${instance}/${wgScriptPath}/api.php`

module.exports = {
  instance,
  wgScriptPath,
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
  buildUrl: require('../../lib/utils/build_url')(instanceApiEndpoint)
}
