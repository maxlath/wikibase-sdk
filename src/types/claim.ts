import type { PropertyId } from './entity.js'
import type { SnakValue } from './snakvalue.js'

export type Rank = 'normal' | 'preferred' | 'deprecated'
export type SnakType = 'value' | 'somevalue' | 'novalue'
export const DataTypes = [
  'commonsMedia',
  'external-id',
  'geo-shape',
  'globe-coordinate',
  'math',
  'monolingualtext',
  'musical-notation',
  'quantity',
  'string',
  'tabular-data',
  'time',
  'url',
  'wikibase-form',
  'wikibase-item',
  'wikibase-lexeme',
  'wikibase-property',
  'wikibase-sense',
] as const
export type DataType = typeof DataTypes[number]

export interface Claim {
  id: string
  mainsnak: Snak
  rank: Rank
  type: DataType
  qualifiers?: Qualifiers
  'qualifiers-order'?: PropertyId[]
  references?: Reference[]
}

export type PropertyClaims = Claim[]
export type PropertySnaks = Snak[]

export type Claims = Record<PropertyId, PropertyClaims>
export type Snaks = Record<PropertyId, PropertySnaks>

export interface Snak {
  // A mainsnak object won't have an id, as its already on the claim
  id?: string
  datatype: DataType
  datavalue?: SnakValue
  hash: string
  property: string
  snaktype: SnakType
}

export interface QualifierSnak extends Snak {
  id: string
}

export type PropertyQualifiers = QualifierSnak[]

export type Qualifiers = Record<PropertyId, PropertyQualifiers>

export interface ReferenceSnak extends Snak {
  id: string
}

export interface Reference {
  hash: string
  snaks: Record<PropertyId, ReferenceSnak[]>
  'snaks-order': PropertyId[]
}

export type References = Reference[]
