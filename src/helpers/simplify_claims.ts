import { uniq } from '../utils/utils.js'
import { parseClaim } from './parse_claim.js'
import { truthyPropertyClaims, nonDeprecatedPropertyClaims } from './rank.js'
import type { Claim, Claims, PropertyClaims, PropertyQualifiers, Qualifier, Qualifiers } from '../types/claim.js'
import type { SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifySnakOptions, SimplifySnaksOptions } from '../types/simplify_claims.js'

function simplifySnaks (snaks, options) {
  const { propertyPrefix } = options
  const simplifiedSnaks: any = {}
  for (let id in snaks) {
    const propertySnaks = snaks[id]
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id
    }
    simplifiedSnaks[id] = simplifyPropertySnaks(propertySnaks, options)
  }
  return simplifiedSnaks
}

function simplifyPropertySnaks (propertySnaks, options) {
  // Avoid to throw on empty inputs to allow to simplify claims array
  // without having to know if the entity as claims for this property
  // Ex: simplifyPropertyClaims(entity.claims.P124211616)
  if (propertySnaks == null || propertySnaks.length === 0) return []

  const { keepNonTruthy, keepNonDeprecated, areSubSnaks } = options

  if (keepNonDeprecated) {
    propertySnaks = nonDeprecatedPropertyClaims(propertySnaks)
  } else if (!(keepNonTruthy || areSubSnaks)) {
    propertySnaks = truthyPropertyClaims(propertySnaks)
  }

  propertySnaks = propertySnaks
    .map(claim => simplifyClaim(claim, options))
    // Filter-out novalue and somevalue claims,
    // unless a novalueValue or a somevalueValue is passed in options
    // Considers null as defined
    .filter(obj => obj !== undefined)

  // Deduplicate values unless we return a rich value object
  if (propertySnaks[0] && typeof propertySnaks[0] !== 'object') {
    return uniq(propertySnaks)
  } else {
    return propertySnaks
  }
}

// Expects a single snak object
// Ex: entity.claims.P369[0]
function simplifySnak (claim, options) {
  const { keepQualifiers, keepReferences, keepIds, keepHashes, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options)

  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  const { mainsnak, rank } = claim

  let value, datatype, datavalue, snaktype, isQualifierSnak, isReferenceSnak
  if (mainsnak) {
    datatype = mainsnak.datatype
    datavalue = mainsnak.datavalue
    snaktype = mainsnak.snaktype
  } else {
    // Qualifiers have no mainsnak, and define datatype, datavalue on claim
    datavalue = claim.datavalue
    datatype = claim.datatype
    snaktype = claim.snaktype
    // Duck typing the sub-snak type
    if (claim.hash) isQualifierSnak = true
    else isReferenceSnak = true
  }

  if (datavalue) {
    value = parseClaim(datatype, datavalue, options, claim.id)
  } else {
    if (snaktype === 'somevalue') value = options.somevalueValue
    else if (snaktype === 'novalue') value = options.novalueValue
    else throw new Error('no datavalue or special snaktype found')
  }

  // Qualifiers should not attempt to keep sub-qualifiers or references
  if (isQualifierSnak) {
    if (!(keepHashes || keepTypes || keepSnaktypes)) return value

    const valueObj: any = { value }

    if (keepHashes) valueObj.hash = claim.hash
    if (keepTypes) valueObj.type = datatype
    if (keepSnaktypes) valueObj.snaktype = snaktype

    return valueObj
  }
  if (isReferenceSnak) {
    if (!keepTypes) return value

    return { type: datatype, value }
  }
  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (!(keepQualifiers || keepReferences || keepIds || keepTypes || keepSnaktypes || keepRanks)) {
    return value
  }

  // When keeping qualifiers or references, the value becomes an object
  // instead of a direct value
  const valueObj: any = { value }

  if (keepTypes) valueObj.type = datatype

  if (keepSnaktypes) valueObj.snaktype = snaktype

  if (keepRanks) valueObj.rank = rank

  const subSnaksOptions = getSubSnakOptions(options)
  subSnaksOptions.keepHashes = keepHashes

  if (keepQualifiers) {
    valueObj.qualifiers = simplifyQualifiers(claim.qualifiers, subSnaksOptions)
  }

  if (keepReferences) {
    claim.references = claim.references || []
    valueObj.references = simplifyReferences(claim.references, subSnaksOptions)
  }

  if (keepIds) valueObj.id = claim.id

  return valueObj
}

export function simplifyClaims (claims: Claims, options: SimplifySnaksOptions = {}): SimplifiedClaims {
  return simplifySnaks(claims, options)
}
export function simplifyPropertyClaims (propertyClaims: PropertyClaims, options: SimplifySnaksOptions = {}): SimplifiedPropertyClaims {
  return simplifyPropertySnaks(propertyClaims, options)
}
export function simplifyClaim (claim: Claim, options: SimplifySnakOptions = {}): SimplifiedClaim {
  return simplifySnak(claim, options)
}

export function simplifyQualifiers (qualifiers: Qualifiers, options: SimplifySnaksOptions = {}) {
  return simplifySnaks(qualifiers, getSubSnakOptions(options))
}
export function simplifyPropertyQualifiers (propertyQualifiers: PropertyQualifiers, options: SimplifySnaksOptions = {}) {
  return simplifyPropertySnaks(propertyQualifiers, getSubSnakOptions(options))
}
export function simplifyQualifier (qualifier: Qualifier, options: SimplifySnakOptions = {}) {
  return simplifySnak(qualifier, options)
}

export function simplifyReferences (references, options) {
  return references.map(refRecord => simplifyReferenceRecord(refRecord, options))
}
export function simplifyReferenceRecord (refRecord, options) {
  const subSnaksOptions = getSubSnakOptions(options)
  const snaks = simplifySnaks(refRecord.snaks, subSnaksOptions)
  if (subSnaksOptions.keepHashes) return { snaks, hash: refRecord.hash }
  else return snaks
}

const getSubSnakOptions = (options: any = {}) => {
  if (options.areSubSnaks) return options
  // Using a new object so that the original options object isn't modified
  else return Object.assign({}, options, { areSubSnaks: true })
}

const keepOptions = [ 'keepQualifiers', 'keepReferences', 'keepIds', 'keepHashes', 'keepTypes', 'keepSnaktypes', 'keepRanks', 'keepRichValues' ]

const parseKeepOptions = options => {
  if (options.keepAll) {
    keepOptions.forEach(optionName => {
      if (options[optionName] == null) options[optionName] = true
    })
  }
  return options
}
