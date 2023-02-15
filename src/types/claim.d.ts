import type { PropertyId } from './entity.js'
import type { parsers } from '../helpers/parse_claim.js'

export type Rank = 'normal' | 'preferred' | 'deprecated'
export type SnakType = 'value' | 'somevalue' | 'novalue'
export type DataType = keyof typeof parsers

export interface Claim {
  id: string
  mainsnak: Snak
  rank: Rank
  type: DataType
  qualifiers?: Qualifiers
  'qualifiers-order'?: string[]
  references?: Reference[]
}

export type PropertyClaims = Claim[]
export type PropertySnaks = Snak[]

export type Claims = Record<PropertyId, PropertyClaims>
export type Snaks = Record<PropertyId, PropertySnaks>

export interface Snak {
  // A mainsnak object won't have an id, as its already on the claim
  id?: string
  datatype: string
  datavalue?: SnakValue
  hash: string
  property: string
  snaktype: SnakType
}

export interface SnakValue {
  type: DataType
  value: unknown
}

export interface ClaimSnakTimeValue extends SnakValue {
  type: 'time'
  value: {
    after: number
    before: number
    calendermodel: string
    precision: number
    time: string
    timezone: number
  }
}

export interface ClaimSnakQuantity extends SnakValue {
  type: 'quantity'
  value: {
    amount: string
    unit: string
    upperBound?: string
    lowerBound?: string
  }
}

export interface ClaimSnakString extends SnakValue {
  type: 'string'
  value: string
}

export interface SnakEntityValue extends SnakValue {
  type: 'wikibase-entityid'
  value: {
    id: string
    'numeric-id': number
    'entity-type': string
  }
}

export type ClaimSnakWikibaseItem = SnakEntityValue

export interface Qualifier extends Snak {
  id: string
}

export type PropertyQualifiers = Qualifier[]

export type Qualifiers = Record<PropertyId, PropertyQualifiers>

export interface ReferenceSnak extends Snak {
  id: string
}

export interface Reference {
  hash: string
  snaks: Record<PropertyId, ReferenceSnak[]>
  'snaks-order': string[]
}

export type References = Reference[]
