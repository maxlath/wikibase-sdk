const wdk = module.exports = {}

wdk.searchEntities = require('./queries/search_entities')
wdk.getEntities = require('./queries/get_entities')
wdk.getManyEntities = require('./queries/get_many_entities')
wdk.sparqlQuery = require('./queries/sparql_query')
wdk.getReverseClaims = require('./queries/get_reverse_claims')
wdk.getRevisions = require('./queries/get_revisions')
wdk.getEntitiesFromSitelinks = require('./queries/get_entities_from_sitelinks')
// Legacy
wdk.getWikidataIdsFromSitelinks = wdk.getEntitiesFromSitelinks

wdk.parse = require('./helpers/parse_responses')

const claimsSimplifiers = require('./helpers/simplify_claims')
const simplifySparqlResults = require('./helpers/simplify_sparql_results')

wdk.simplify = require('../lib/helpers/simplify_text_attributes')
const { simplifyEntity, simplifyEntities } = require('../lib/helpers/simplify_entity')
wdk.simplify.entity = simplifyEntity
wdk.simplify.entities = simplifyEntities

wdk.simplify.claim = claimsSimplifiers.simplifyClaim
wdk.simplify.propertyClaims = claimsSimplifiers.simplifyPropertyClaims
wdk.simplify.claims = claimsSimplifiers.simplifyClaims
wdk.simplify.qualifier = claimsSimplifiers.simplifyQualifiers
wdk.simplify.propertyQualifiers = claimsSimplifiers.simplifyPropertyQualifiers
wdk.simplify.qualifiers = claimsSimplifiers.simplifyQualifier

wdk.simplify.sitelinks = require('../lib/helpers/simplify_sitelinks')
wdk.simplify.sparqlResults = simplifySparqlResults

// Legacy
wdk.simplifySparqlResults = require('./helpers/simplify_sparql_results')
// Legacy + truthyClaims + truthyPropertyClaims
Object.assign(wdk, claimsSimplifiers)

// Aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks

const helpers = require('../lib/helpers/helpers')
const sitelinksHelpers = require('../lib/helpers/sitelinks_helpers')
Object.assign(wdk, helpers, sitelinksHelpers)
