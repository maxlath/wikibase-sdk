import type { Guid, PropertyId } from './entity.js'
import type { SnakDataValue } from './snakvalue.js'
import type { Datatype } from '../helpers/parse_snak.js'
import type { ranks } from '../helpers/rank.js'

export type Rank = typeof ranks[number]

export interface ClaimBase {
  id: Guid
  rank: Rank
  type: 'statement'
  'qualifiers-order'?: PropertyId[]
}

export interface Claim extends ClaimBase {
  mainsnak: Snak
  qualifiers?: Qualifiers
  references?: Reference[]
}

export interface Statement extends ClaimBase {
  mainsnak: SnakBase
  qualifiers?: StatementQualifiers
  references?: StatementReference[]
}

export type PropertyClaims = Claim[]
export type PropertyStatements = Statement[]
export type PropertySnaks = Snak[]

export type Claims = Record<PropertyId, PropertyClaims>
export type Statements = Record<PropertyId, PropertyStatements>
export type Snaks = Record<PropertyId, PropertySnaks>

interface SnakRootBase {
  hash: string
  property: PropertyId
}

export interface SnakBaseWithValue extends SnakRootBase {
  snaktype: 'value'
  datavalue: SnakDataValue
}

export interface SnakBaseWithSomeValue extends SnakRootBase {
  snaktype: 'somevalue'
}

export interface SnakBaseWithNoValue extends SnakRootBase {
  snaktype: 'novalue'
}

export type SnakBase = SnakBaseWithValue | SnakBaseWithSomeValue | SnakBaseWithNoValue

export type SnakType = SnakBase['snaktype']

export interface SnakWithValue extends SnakRootBase {
  snaktype: 'value'
  datavalue: SnakDataValue
  datatype: Datatype
}

export interface SnakWithSomeValue extends SnakRootBase {
  snaktype: 'somevalue'
  datatype: Datatype
}

export interface SnakWithNoValue extends SnakRootBase {
  snaktype: 'novalue'
  datatype: Datatype
}

export type Snak = SnakWithValue | SnakWithSomeValue | SnakWithNoValue

export type Qualifier = Snak
export type StatementQualifier = SnakBase

export type PropertyQualifiers = Qualifier[]
export type PropertyStatementQualifiers = StatementQualifier[]

export type Qualifiers = Record<PropertyId, PropertyQualifiers>
export type StatementQualifiers = Record<PropertyId, PropertyStatementQualifiers>

export type ReferenceSnak = Snak
export type ReferenceStatementSnak = Snak

export interface ReferenceBase {
  hash: string
  'snaks-order': PropertyId[]
}
export interface Reference extends ReferenceBase {
  snaks: Record<PropertyId, ReferenceSnak[]>
}
export interface StatementReference {
  snaks: Record<PropertyId, ReferenceStatementSnak[]>
}

export type References = Reference[]
