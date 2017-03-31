const helpers = require('./helpers')

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
  const { entityPrefix, propertyPrefix, keepQualifiers, timeConverter } = parseOptions(options)
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
      value = getTimeConverter(timeConverter)(datavalue.value.time)
      break
    case 'quantity':
      value = parseFloat(datavalue.value.amount)
      break
    case 'globe-coordinate':
      value = getLatLngFromCoordinates(datavalue.value)
      break
  }

  if (keepQualifiers) {
    const simpleQualifiers = {}

    for (let qualifierProp in qualifiers) {
      simpleQualifiers[qualifierProp] = qualifiers[qualifierProp]
        .map(prepareQualifierClaim)
    }

    return {
      value,
      qualifiers: simplifyClaims(simpleQualifiers, entityPrefix, propertyPrefix)
    }
  } else {
    return value
  }
}

const parseOptions = function (options) {
  if (options == null) return {}

  if (options[0] && typeof options[0] === 'object') return options[0]

  // Legacy interface
  var [ entityPrefix, propertyPrefix, keepQualifiers ] = options
  return { entityPrefix, propertyPrefix, keepQualifiers }
}

const prefixedId = function (datavalue, prefix) {
  const { id } = datavalue.value
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

const getLatLngFromCoordinates = (value) => [ value.latitude, value.longitude ]

const prepareQualifierClaim = (claim) => ({ mainsnak: claim })

const timeConverters = {
  iso: helpers.wikidataTimeToISOString,
  epoch: helpers.wikidataTimeToEpochTime,
  none: (time) => time
}

const getTimeConverter = (key) => timeConverters[key] || timeConverters.iso

module.exports = { simplifyClaims, simplifyPropertyClaims, simplifyClaim }
