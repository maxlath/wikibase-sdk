module.exports = wdk = {}

helpers = require './helpers/helpers'

wdk.searchEntities = require './queries/wikidata_search_entities'
wdk.getEntities = require './queries/wikidata_get_entities'
wdk.getManyEntities = require './queries/wikidata_get_many_entities'
wdk.getWikidataIdsFromSitelinks = require './queries/get_wikidata_ids_from_sitelinks'
wdk.sparqlQuery = require './queries/wikidata_sparql_query'
wdk.getReverseClaims = require './queries/wdq_get_reverse_claims'
wdk.parse = require './helpers/parse_responses'

{ simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require './helpers/simplify_claims'
wdk.simplifyClaim = simplifyClaim
wdk.simplifyPropertyClaims = simplifyPropertyClaims
wdk.simplifyClaims = simplifyClaims

wdk.simplifySparqlResults = require './queries/wikidata_simplify_sparql_results'

# aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks

# making helpers both available from root
# and from wdk.helpers
wdk.helpers = helpers
# equivalent to _.extend wdk, helpers
for k, v of helpers
  wdk[k] = v
