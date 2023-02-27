import type { DataType, Rank } from './claim.js'
import type { Guid, PropertyId } from './entity.js'
import type { TimeConverter, TimeConverterFn } from '../helpers/wikibase_time.js'

export interface SimplifySnakOptions {
  entityPrefix?: string
  propertyPrefix?: string
  keepAll?: boolean
  keepHashes?: boolean
  keepIds?: boolean
  keepQualifiers?: boolean
  keepRanks?: boolean
  keepReferences?: boolean
  keepRichValues?: boolean
  keepSnaktypes?: boolean
  keepTypes?: boolean
  timeConverter?: TimeConverter | TimeConverterFn
  novalueValue?: any
  somevalueValue?: any
}

export interface SimplifySnaksOptions extends SimplifySnakOptions {
  areSubSnaks?: boolean
  keepNonTruthy?: boolean
  keepNonDeprecated?: boolean
}

export type SimplifyClaimsOptions = SimplifySnaksOptions

export interface CustomSimplifiedClaim extends CustomSimplifiedSnak {
  id: Guid
  rank?: Rank
  qualifiers?: SimplifiedQualifiers
  references?: SimplifiedReferences
}
export type SimplifiedPropertyClaims = SimplifiedClaim[]
export type SimplifiedPropertySnaks = SimplifiedSnak[]

export type SimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims>
export type SimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks>

export type SimplifiedQualifier = SimplifiedSnak
export type SimplifiedPropertyQualifiers = SimplifiedQualifier[]
export type SimplifiedQualifiers = Record<string, SimplifiedPropertyQualifiers>

export type SimplifiedReferenceSnak = SimplifiedSnak
export type SimplifiedReference = Record<string, SimplifiedReferenceSnak>
export type SimplifiedReferences = SimplifiedReference[]

export type SimplifiedSnak = string | number | CustomSimplifiedSnak
export type SimplifiedClaim = string | number | CustomSimplifiedClaim

export interface CustomSimplifiedSnak {
  id: string
  type?: DataType
  value: unknown
}
