const helpers = require('./helpers')

// Expects an entity 'claims' object
// Ex: entity.claims
const simplifyClaims = function (claims, entityPrefix, propertyPrefix, keepQualifiers) {
  const simpleClaims = {}
  for (let id in claims) {
    let propClaims = claims[id]
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id
    }
    simpleClaims[id] = simplifyPropertyClaims(propClaims, entityPrefix, propertyPrefix, keepQualifiers)
  }
  return simpleClaims
}

// Expects the 'claims' array of a particular property
// Ex: entity.claims.P369
const simplifyPropertyClaims = function (propClaims, entityPrefix, propertyPrefix, keepQualifiers) {
  return propClaims
  .map((claim) => simplifyClaim(claim, entityPrefix, propertyPrefix, keepQualifiers))
  .filter(nonNull)
}

const nonNull = (obj) => obj != null

// Expects a single claim object
// Ex: entity.claims.P369[0]
const simplifyClaim = function (claim, entityPrefix, propertyPrefix, keepQualifiers) {
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  const { mainsnak, qualifiers } = claim

  // should only happen in snaktype: `novalue` cases or alikes
  if (mainsnak == null) return null

  const { datatype, datavalue } = mainsnak
  // known case: snaktype set to `somevalue`
  if (datavalue == null) return null
  
  let value = null
  
  switch (datatype) {
    case 'string':
    case 'commonsMedia':
    case 'url':
    case 'external-id':
      value = datavalue.value
      break
    case 'monolingualtext':
      value = datavalue.value.text
      break
    case 'wikibase-item':
      value = prefixedId(datavalue, entityPrefix)
      break
    case 'wikibase-property':
      value = prefixedId(datavalue, propertyPrefix)
      break
    case 'time':
      value = helpers.normalizeWikidataTime(datavalue.value.time)
      break
    case 'quantity':
      value = parseFloat(datavalue.value.amount)
      break
    case 'globe-coordinate':
      value = getLatLngFromCoordinates(datavalue.value)
      break
  }
  
  if ( keepQualifiers ) {
    let simpleQualifiers = {}
    
    for (let qualifierProp in qualifiers) {
      simpleQualifiers[qualifierProp] = qualifiers[qualifierProp]
      .slice()
      .map((claim) => simplifyClaim({ mainsnak: claim }, entityPrefix, propertyPrefix))
    }
    
    return { value, qualifiers: simpleQualifiers }
  } else {
    return value
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
