import { uniq } from '../utils/utils.js'
import { parseClaim } from './parse_claim.js'
import { truthyPropertyClaims, nonDeprecatedPropertyClaims } from './rank.js'
import type { Claim, Claims, DataType, PropertyClaims, PropertyQualifiers, QualifierSnak, Qualifiers, Reference, ReferenceSnak, SnakType } from '../types/claim.js'
import type { PropertyId } from '../types/entity.js'
import type { SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifySnakOptions, SimplifySnaksOptions } from '../types/simplify_claims.js'
import type { SnakValue } from '../types/snakvalue.js'

function simplifySnaks (snaks: Record<PropertyId, any[]>, options: SimplifySnaksOptions) {
  const { propertyPrefix } = options
  const simplifiedSnaks: any = {}
  for (let [ id, propertySnaks ] of Object.entries(snaks)) {
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id
    }
    simplifiedSnaks[id] = simplifyPropertySnaks(propertySnaks, options)
  }
  return simplifiedSnaks
}

function simplifyPropertySnaks (propertySnaks: any[], options: SimplifySnaksOptions) {
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

  const simplified = propertySnaks
    .map(claim => simplifyClaim(claim, options))
    // Filter-out novalue and somevalue claims,
    // unless a novalueValue or a somevalueValue is passed in options
    // Considers null as defined
    .filter(obj => obj !== undefined)

  // Deduplicate values unless we return a rich value object
  if (simplified[0] && typeof simplified[0] !== 'object') {
    return uniq(simplified)
  } else {
    return simplified
  }
}

/**
 * tries to replace wikidata deep claim object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 *
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
function simplifySnak (claim: Claim | QualifierSnak | ReferenceSnak, options: SimplifySnakOptions) {
  const { keepQualifiers, keepReferences, keepIds, keepHashes, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options)

  let datatype: DataType | undefined
  let datavalue: SnakValue
  let snaktype: SnakType
  let isQualifierSnak: boolean
  let isReferenceSnak: boolean
  if ('mainsnak' in claim) {
    datatype = claim.mainsnak.datatype
    datavalue = claim.mainsnak.datavalue
    snaktype = claim.mainsnak.snaktype
  } else {
    // Qualifiers have no mainsnak, and define datatype, datavalue on claim
    datavalue = claim.datavalue
    datatype = claim.datatype
    snaktype = claim.snaktype
    // Duck typing the sub-snak type
    if (claim.hash) isQualifierSnak = true
    else isReferenceSnak = true
  }

  let value: any
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

    if (keepHashes && 'hash' in claim) valueObj.hash = claim.hash
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

  if (keepRanks && 'rank' in claim) valueObj.rank = claim.rank

  const subSnaksOptions = { ...options, areSubSnaks: true }

  if (keepQualifiers) {
    valueObj.qualifiers = 'qualifiers' in claim ? simplifyQualifiers(claim.qualifiers, subSnaksOptions) : {}
  }

  if (keepReferences) {
    valueObj.references = 'references' in claim ? simplifyReferences(claim.references, subSnaksOptions) : []
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
  return simplifySnaks(qualifiers, { ...options, areSubSnaks: true })
}
export function simplifyPropertyQualifiers (propertyQualifiers: PropertyQualifiers, options: SimplifySnaksOptions = {}) {
  return simplifyPropertySnaks(propertyQualifiers, { ...options, areSubSnaks: true })
}
export function simplifyQualifier (qualifier: QualifierSnak, options: SimplifySnakOptions = {}) {
  return simplifySnak(qualifier, options)
}

export function simplifyReferences (references: Reference[], options: SimplifySnaksOptions) {
  return references.map(refRecord => simplifyReferenceRecord(refRecord, options))
}
export function simplifyReferenceRecord (refRecord: Reference, options: SimplifySnaksOptions) {
  const subSnaksOptions = { ...options, areSubSnaks: true }
  const snaks = simplifySnaks(refRecord.snaks, subSnaksOptions)
  if (subSnaksOptions.keepHashes) return { snaks, hash: refRecord.hash }
  else return snaks
}

const keepOptions = [
  'keepHashes',
  'keepIds',
  'keepQualifiers',
  'keepRanks',
  'keepReferences',
  'keepRichValues',
  'keepSnaktypes',
  'keepTypes',
] as const
type KeepOption = typeof keepOptions[number]

const parseKeepOptions = (options: SimplifySnakOptions): Record<KeepOption, boolean> => {
  if (options.keepAll) {
    keepOptions.forEach(optionName => {
      options[optionName] = options[optionName] ?? true
    })
  }
  return options as Record<KeepOption, boolean>
}
