const wdk = module.exports = {}

wdk.searchEntities = require('./queries/search_entities')
wdk.getEntities = require('./queries/get_entities')
wdk.getManyEntities = require('./queries/get_many_entities')
wdk.getWikidataIdsFromSitelinks = require('./queries/get_wikidata_ids_from_sitelinks')
wdk.sparqlQuery = require('./queries/sparql_query')
wdk.getReverseClaims = require('./queries/get_reverse_claims')
wdk.parse = require('./helpers/parse_responses')

const { simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('./helpers/simplify_claims')
wdk.simplifyClaim = simplifyClaim
wdk.simplifyPropertyClaims = simplifyPropertyClaims
wdk.simplifyClaims = simplifyClaims

// { simplifyLabels, simplifyDescriptions, simplifyAliases, simplifySitelinks }
const simplifyTextAttributes = require('../lib/helpers/simplify_text_attributes')
Object.assign(wdk, simplifyTextAttributes)

wdk.simplifySparqlResults = require('./queries/simplify_sparql_results')

// Aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks

// Making helpers both available from root
// and from wdk.helpers
const helpers = require('./helpers/helpers')
wdk.helpers = helpers
// equivalent to _.extend wdk, helpers
for (let key in helpers) {
  wdk[key] = helpers[key]
}
