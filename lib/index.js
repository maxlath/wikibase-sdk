const { isPlainObject } = require('./utils/utils')

module.exports = config => {
  if (!isPlainObject(config)) throw new Error('invalid config')
  const { instance, sparqlEndpoint } = config
  validateEndpoint('instance', instance)
  validateEndpoint('sparqlEndpoint', sparqlEndpoint)

  const buildUrl = require('./utils/build_url')(instance)

  const wbk = {}
  wbk.searchEntities = require('./queries/search_entities')(buildUrl)
  wbk.getEntities = require('./queries/get_entities')(buildUrl)
  wbk.getManyEntities = require('./queries/get_many_entities')(buildUrl)
  wbk.sparqlQuery = require('./queries/sparql_query')(sparqlEndpoint)
  wbk.getReverseClaims = require('./queries/get_reverse_claims')(sparqlEndpoint)
  wbk.getRevisions = require('./queries/get_revisions')(buildUrl)
  wbk.getEntityRevision = require('./queries/get_entity_revision')(instance)
  wbk.getEntitiesFromSitelinks = require('./queries/get_entities_from_sitelinks')(buildUrl)

  wbk.parse = require('./helpers/parse_responses')

  const claimsSimplifiers = require('./helpers/simplify_claims')
  const simplifySparqlResults = require('./helpers/simplify_sparql_results')

  wbk.simplify = require('../lib/helpers/simplify_text_attributes')
  const { simplifyEntity, simplifyEntities } = require('../lib/helpers/simplify_entity')
  wbk.simplify.entity = simplifyEntity
  wbk.simplify.entities = simplifyEntities

  wbk.simplify.claim = claimsSimplifiers.simplifyClaim
  wbk.simplify.propertyClaims = claimsSimplifiers.simplifyPropertyClaims
  wbk.simplify.claims = claimsSimplifiers.simplifyClaims
  wbk.simplify.qualifier = claimsSimplifiers.simplifyQualifier
  wbk.simplify.propertyQualifiers = claimsSimplifiers.simplifyPropertyQualifiers
  wbk.simplify.qualifiers = claimsSimplifiers.simplifyQualifiers

  wbk.simplify.sitelinks = require('../lib/helpers/simplify_sitelinks')
  wbk.simplify.sparqlResults = simplifySparqlResults

  // Legacy
  wbk.simplifySparqlResults = require('./helpers/simplify_sparql_results')
  // Legacy + truthyClaims + truthyPropertyClaims
  Object.assign(wbk, claimsSimplifiers)

  const helpers = require('../lib/helpers/helpers')
  const sitelinksHelpers = require('../lib/helpers/sitelinks_helpers')
  Object.assign(wbk, helpers, sitelinksHelpers)
  return wbk
}

const validateEndpoint = (name, url) => {
  if (!(typeof url === 'string' && url.startsWith('http'))) {
    throw new Error(`invalid ${name}: ${url}`)
  }
}
