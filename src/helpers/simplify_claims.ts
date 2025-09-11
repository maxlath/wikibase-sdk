import { isPlainObject, typedEntries, uniq } from '../utils/utils.js'
import { parseSnakDatavalue } from './parse_snak.js'
import { truthyPropertyClaims, nonDeprecatedPropertyClaims } from './rank.js'
import type { Claim, PropertyQualifiers, PropertySnaks, PropertyStatementQualifiers, PropertyStatementSnaks, Qualifier, Qualifiers, Reference, Snak, Snaks, Statement, StatementQualifier, StatementQualifiers, StatementReference, StatementSnak, StatementSnaks } from '../types/claim.js'
import type { PropertyId } from '../types/entity.js'
import type { CustomSimplifiedClaim, CustomSimplifiedSnak, SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifiedPropertySnaks, SimplifiedSnaks, SimplifyClaimsOptions, SimplifySnakOptions, SimplifySnaksOptions } from '../types/simplify_claims.js'
import type { TimeSnakDataValue } from '../types/snakvalue.js'

/**
 * Tries to replace wikidata deep snak object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
export function simplifySnak (snak: Snak | StatementSnak, options: SimplifySnakOptions = {}) {
  const { keepTypes, keepSnaktypes, keepHashes } = parseKeepOptions(options)

  let value
  let { snaktype, hash } = snak

  if ('datavalue' in snak) {
    value = parseSnakDatavalue(snak.datavalue, options)
  } else {
    if (snaktype === 'somevalue') value = options.somevalueValue
    else if (snaktype === 'novalue') value = options.novalueValue
    else throw new Error('no datavalue or special snaktype found')
  }

  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (keepTypes || keepSnaktypes || keepHashes) {
    // When keeping qualifiers or references, the value becomes an object
    // instead of a direct value
    const valueObj: CustomSimplifiedSnak = { value }
    // Known case of snak without datatype: Wikimedia Commons MediaInfo snaks
    if (keepTypes && 'datatype' in snak) valueObj.datatype = snak.datatype
    if (keepSnaktypes) valueObj.snaktype = snaktype
    if (keepHashes) valueObj.hash = hash
    return valueObj
  } else {
    return value
  }
}

export function simplifyClaim (claim: Claim | Statement, options: SimplifyClaimsOptions = {}): SimplifiedClaim {
  const { keepQualifiers, keepReferences, keepIds, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options)

  const { mainsnak, rank } = claim

  const value = simplifySnak(mainsnak, options)

  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (!(keepQualifiers || keepReferences || keepIds || keepTypes || keepSnaktypes || keepRanks)) {
    return value
  }

  // When keeping other attributes, the value becomes an object instead of a direct value
  let valueObj: CustomSimplifiedClaim = { value }
  if (isPlainObject(value) && 'value' in value) {
    valueObj = value
  } else {
    valueObj = { value }
  }

  if (keepRanks) valueObj.rank = rank

  if (keepQualifiers) {
    valueObj.qualifiers = simplifyQualifiers(claim.qualifiers, options)
  }

  if (keepReferences) {
    claim.references = claim.references || []
    valueObj.references = simplifyReferences(claim.references, options)
  }

  if (keepIds) valueObj.id = claim.id

  return valueObj
}

export function simplifyClaims <T extends (Claim | Statement)> (claims: Record<PropertyId, T[]>, options: SimplifyClaimsOptions = {}): SimplifiedClaims {
  const { propertyPrefix } = options
  const simplified: SimplifiedClaims = {}
  for (let [ propertyId, propertyArray ] of typedEntries(claims)) {
    if (propertyPrefix) {
      propertyId = propertyPrefix + ':' + propertyId
    }
    simplified[propertyId] = simplifyPropertyClaims(propertyArray, options)
  }
  return simplified
}

export function simplifyPropertyClaims <T extends (Claim | Statement)> (propertyClaims: T[], options: SimplifyClaimsOptions = {}): SimplifiedPropertyClaims {
  // Avoid to throw on empty inputs to allow to simplify claims array
  // without having to know if the entity as claims for this property
  // Ex: simplifyPropertyClaims(entity.claims.P124211616)
  if (propertyClaims == null || propertyClaims.length === 0) return []

  const { keepNonTruthy, keepNonDeprecated } = parseKeepOptions(options)
  const { minTimePrecision } = options

  if (keepNonDeprecated) {
    propertyClaims = nonDeprecatedPropertyClaims(propertyClaims)
  } else if (!(keepNonTruthy)) {
    propertyClaims = truthyPropertyClaims(propertyClaims)
  }

  const simplifiedArray: SimplifiedClaim[] = []
  for (const claim of propertyClaims) {
    const isDroppedClaim = timeSnakPrecisionIsTooLow(claim.mainsnak, minTimePrecision)
    if (!isDroppedClaim) {
      const simplifiedClaim = simplifyClaim(claim, options)
      // Filter-out novalue and somevalue claims,
      // unless a novalueValue or a somevalueValue is passed in options
      // Considers null as defined
      if (simplifiedClaim !== undefined) simplifiedArray.push(simplifiedClaim)
    }
  }

  // Deduplicate values unless we return a rich value object
  if (simplifiedArray[0] && typeof simplifiedArray[0] !== 'object') {
    return uniq(simplifiedArray)
  } else {
    return simplifiedArray
  }
}

export function simplifySnaks (snaks: Snaks | StatementSnaks = {}, options: SimplifySnaksOptions = {}): SimplifiedSnaks {
  const { propertyPrefix } = options
  const simplified: SimplifiedSnaks = {}
  for (let [ propertyId, propertyArray ] of typedEntries(snaks)) {
    if (propertyPrefix) {
      propertyId = propertyPrefix + ':' + propertyId
    }
    simplified[propertyId] = simplifyPropertySnaks(propertyArray, options)
  }
  return simplified
}

export function simplifyPropertySnaks (propertySnaks: PropertySnaks | PropertyStatementSnaks, options: SimplifySnaksOptions = {}): SimplifiedPropertySnaks {
  if (propertySnaks == null || propertySnaks.length === 0) return []

  const { minTimePrecision } = options

  const simplifiedArray: SimplifiedClaim[] = []
  for (const snak of propertySnaks) {
    const isDroppedSnak = timeSnakPrecisionIsTooLow(snak, minTimePrecision)
    if (!isDroppedSnak) {
      const simplifiedSnak = simplifySnak(snak, options)
      // Filter-out novalue and somevalue snaks,
      // unless a novalueValue or a somevalueValue is passed in options
      // Considers null as defined
      if (simplifiedSnak !== undefined) simplifiedArray.push(simplifiedSnak)
    }
  }

  // Deduplicate values unless we return a rich value object
  if (simplifiedArray[0] && typeof simplifiedArray[0] !== 'object') {
    return uniq(simplifiedArray)
  } else {
    return simplifiedArray
  }
}

export function simplifyQualifiers (qualifiers: Qualifiers | StatementQualifiers, options: SimplifySnaksOptions = {}) {
  return simplifySnaks(qualifiers, options)
}
export function simplifyPropertyQualifiers (propertyQualifiers: PropertyQualifiers | PropertyStatementQualifiers, options: SimplifySnaksOptions = {}) {
  return simplifyPropertySnaks(propertyQualifiers, options)
}
export function simplifyQualifier (qualifier: Qualifier | StatementQualifier, options: SimplifySnakOptions = {}) {
  return simplifySnak(qualifier, options)
}

export function simplifyReferences (references: Reference[] | StatementReference[], options: SimplifySnaksOptions = {}) {
  return references.map(reference => simplifyReference(reference, options))
}
export function simplifyReference (reference: Reference | StatementReference, options: SimplifySnaksOptions = {}) {
  const snaks = simplifySnaks(reference.snaks, options)
  if (options.keepHashes) return { snaks, hash: reference.hash }
  else return snaks
}
/** @deprecated use the new function name simplifyReference instead */
export const simplifyReferenceRecord = simplifyReference

const keepOptions = [
  'keepHashes',
  'keepIds',
  'keepNonDeprecated',
  'keepNonTruthy',
  'keepQualifiers',
  'keepRanks',
  'keepReferences',
  'keepRichValues',
  'keepSnaktypes',
  'keepTypes',
] as const

function parseKeepOptions (options: SimplifyClaimsOptions = {}) {
  if (options.keepAll) {
    for (const optionName of keepOptions) {
      if (options[optionName] == null) options[optionName] = true
    }
  }
  return options
}

function timeSnakPrecisionIsTooLow (snak: Snak | StatementSnak, minTimePrecision?: number) {
  if (minTimePrecision == null) return false
  if (!('datatype' in snak) || snak.datatype !== 'time' || snak.snaktype !== 'value') return false
  const { value } = snak.datavalue as TimeSnakDataValue
  return value.precision < minTimePrecision
}
