const { parse: parseClaim } = require('./parse_claim')
const { uniq } = require('../utils/utils')

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
  // Avoid to throw on empty inputs to allow to simplify claims array
  // without having to know if the entity as claims for this property
  // Ex: simplifyPropertyClaims(entity.claims.P124211616)
  if (propClaims == null || propClaims.length === 0) return []

  const { keepNonTruthy, areSubSnaks } = parseOptions(options)
  if (!(keepNonTruthy || areSubSnaks)) {
    propClaims = truthyPropertyClaims(propClaims)
  }

  propClaims = propClaims
    .map(claim => simplifyClaim(claim, ...options))
    .filter(nonNull)

  // Deduplicate values unless we return a rich value object
  if (propClaims[0] && typeof propClaims[0] !== 'object') {
    return uniq(propClaims)
  } else {
    return propClaims
  }
}

const aggregatePerRank = function (aggregate, claim) {
  const { rank } = claim
  aggregate[rank] || (aggregate[rank] = [])
  aggregate[rank].push(claim)
  return aggregate
}

const truthyPropertyClaims = function (propClaims) {
  const aggregate = propClaims.reduce(aggregatePerRank, {})
  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || []
}

const truthyClaims = function (claims) {
  const truthClaimsOnly = {}
  Object.keys(claims).forEach(property => {
    truthClaimsOnly[property] = truthyPropertyClaims(claims[property])
  })
  return truthClaimsOnly
}

const nonNull = obj => obj != null

// Expects a single claim object
// Ex: entity.claims.P369[0]
const simplifyClaim = function (claim, ...options) {
  options = parseOptions(options)
  const { keepQualifiers, keepReferences, keepIds, keepHashes, keepTypes } = options
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  const { mainsnak } = claim

  var datatype, datavalue, isQualifierSnak, isReferenceSnak
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
    // Duck typing the sub-snak type
    if (claim.hash) isQualifierSnak = true
    else isReferenceSnak = true
  }

  const value = parseClaim(datatype, datavalue, options, claim.id)

  // Qualifiers should not attempt to keep sub-qualifiers or references
  if (isQualifierSnak) {
    if (!(keepHashes || keepTypes)) return value

    const richValue = { value }

    if (keepHashes) richValue.hash = claim.hash
    if (keepTypes) richValue.type = datatype

    return richValue
  }

  if (isReferenceSnak) {
    if (!keepTypes) return value

    return { type: datatype, value }
  }

  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (!(keepQualifiers || keepReferences || keepIds || keepTypes)) return value

  // When keeping qualifiers or references, the value becomes an object
  // instead of a direct value
  const richValue = { value }

  if (keepTypes) {
    richValue.type = datatype
  }

  const subSnaksOptions = getSubSnakOptions(options)
  subSnaksOptions.keepHashes = keepHashes

  if (keepQualifiers) {
    richValue.qualifiers = simplifyClaims(claim.qualifiers, subSnaksOptions)
  }

  if (keepReferences) {
    claim.references = claim.references || []
    richValue.references = claim.references.map(refRecord => {
      const snaks = simplifyClaims(refRecord.snaks, subSnaksOptions)
      if (keepHashes) return { snaks, hash: refRecord.hash }
      else return snaks
    })
  }

  if (keepIds) richValue.id = claim.id

  return richValue
}

const parseOptions = function (options) {
  if (options == null) return {}

  if (options[0] && typeof options[0] === 'object') return options[0]

  // Legacy interface
  var [ entityPrefix, propertyPrefix, keepQualifiers ] = options
  return { entityPrefix, propertyPrefix, keepQualifiers }
}

const simplifyQualifiers = (claims, options) => {
  return simplifyClaims(claims, getSubSnakOptions(options))
}

const simplifyPropertyQualifiers = (propClaims, options) => {
  return simplifyPropertyClaims(propClaims, getSubSnakOptions(options))
}

// Using a new object so that the original options object isn't modified
const getSubSnakOptions = options => {
  return Object.assign({}, options, { areSubSnaks: true })
}

module.exports = {
  simplifyClaims,
  simplifyPropertyClaims,
  simplifyClaim,
  truthyClaims,
  truthyPropertyClaims,
  simplifyQualifiers,
  simplifyPropertyQualifiers,
  simplifyQualifier: simplifyClaim
}
