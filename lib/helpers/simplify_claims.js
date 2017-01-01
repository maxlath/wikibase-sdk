const helpers = require('./helpers')

// Expects an entity 'claims' object
// Ex: entity.claims
const simplifyClaims = function (claims, entityPrefix, propertyPrefix) {
  const simpleClaims = {}
  for (let id in claims) {
    let propClaims = claims[id]
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id
    }
    simpleClaims[id] = simplifyPropertyClaims(propClaims, entityPrefix, propertyPrefix)
  }
  return simpleClaims
}

// Expects the 'claims' array of a particular property
// Ex: entity.claims.P369
const simplifyPropertyClaims = function (propClaims, entityPrefix, propertyPrefix) {
  return propClaims
  .map((claim) => simplifyClaim(claim, entityPrefix, propertyPrefix))
  .filter(nonNull)
}

const nonNull = (obj) => obj != null

// Expects a single claim object
// Ex: entity.claims.P369[0]
const simplifyClaim = function (claim, entityPrefix, propertyPrefix) {
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  const { mainsnak } = claim

  // should only happen in snaktype: `novalue` cases or alikes
  if (mainsnak == null) return null

  const { datatype, datavalue } = mainsnak
  // known case: snaktype set to `somevalue`
  if (datavalue == null) return null

  switch (datatype) {
    case 'string':
    case 'commonsMedia':
    case 'url':
    case 'external-id':
      return datavalue.value
    case 'monolingualtext':
      return datavalue.value.text
    case 'wikibase-item':
      return prefixedId(datavalue, entityPrefix)
    case 'wikibase-property':
      return prefixedId(datavalue, propertyPrefix)
    case 'time':
      return helpers.normalizeWikidataTime(datavalue.value.time)
    case 'quantity':
      return parseFloat(datavalue.value.amount)
    case 'globe-coordinate':
      return getLatLngFromCoordinates(datavalue.value)
    default:
      return null
  }
}

const prefixedId = function (datavalue, prefix) {
  const { id } = datavalue.value
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

const getLatLngFromCoordinates = (value) => [ value.latitude, value.longitude ]

module.exports = {
  simplifyClaims: simplifyClaims,
  simplifyPropertyClaims: simplifyPropertyClaims,
  simplifyClaim: simplifyClaim
}
