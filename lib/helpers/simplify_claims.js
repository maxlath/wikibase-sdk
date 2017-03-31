const parseClaim = require('./parse_claim')

// Expects an entity 'claims' object
// Ex: entity.claims
const simplifyClaims = function (claims, ...options) {
  const { propertyPrefix } = parseOptions(options)
  const simpleClaims = {}
  for (let id in claims) {
    let propClaims = claims[id]
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id
    }
    simpleClaims[id] = simplifyPropertyClaims(propClaims, ...options)
  }
  return simpleClaims
}

// Expects the 'claims' array of a particular property
// Ex: entity.claims.P369
const simplifyPropertyClaims = function (propClaims, ...options) {
  return propClaims
  .map((claim) => simplifyClaim(claim, ...options))
  .filter(nonNull)
}

const nonNull = (obj) => obj != null

// Expects a single claim object
// Ex: entity.claims.P369[0]
const simplifyClaim = function (claim, ...options) {
  options = parseOptions(options)
  const { keepQualifiers } = options
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  const { mainsnak, qualifiers } = claim

  var datatype, datavalue, isQualifier
  if (mainsnak) {
    datatype = mainsnak.datatype
    datavalue = mainsnak.datavalue
    // Known case: snaktype set to `somevalue`
    if (!datavalue) return null
  } else {
    // Should only happen in snaktype: `novalue` cases or alikes
    if (!(claim && claim.datavalue)) return null
    // Qualifiers have no mainsnak, and define datatype, datavalue on claim
    datavalue = claim.datavalue
    datatype = claim.datatype
    isQualifier = true
  }

  const value = parseClaim(datatype, datavalue, options)

  // Qualifiers should not attempt to keep sub-qualifiers
  if (!keepQualifiers || isQualifier) return value

  // When keeping qualifiers, the value becomes an object
  // instead of a direct value
  return { value, qualifiers: simplifyClaims(qualifiers, options) }
}

const parseOptions = function (options) {
  if (options == null) return {}

  if (options[0] && typeof options[0] === 'object') return options[0]

  // Legacy interface
  var [ entityPrefix, propertyPrefix, keepQualifiers ] = options
  return { entityPrefix, propertyPrefix, keepQualifiers }
}

module.exports = { simplifyClaims, simplifyPropertyClaims, simplifyClaim }
