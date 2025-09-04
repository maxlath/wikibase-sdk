import type { Rank, SnakType } from './claim.js'
import type { EntityId, EntitySchemaId, FormId, Guid, Hash, ItemId, LexemeId, MediaInfoId, PropertyId, SenseId } from './entity.js'
import type { GlobeCoordinateSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, SnakDataValue, TimeSnakDataValue } from './snakvalue.js'
import type { SnakDatatype, timeConverters } from '../helpers/parse_snak.js'
import type { TimeConverter } from '../helpers/time.js'

export interface SimplifySnakOptions {
  entityPrefix?: string
  propertyPrefix?: string
  keepRichValues?: boolean
  keepTypes?: boolean
  keepQualifiers?: boolean
  keepReferences?: boolean
  keepHashes?: boolean
  keepSnaktypes?: boolean
  keepAll?: boolean
  timeConverter?: keyof typeof timeConverters | TimeConverter<unknown>
  novalueValue?: unknown
  somevalueValue?: unknown
  minTimePrecision?: number
}

export type SimplifySnaksOptions = SimplifySnakOptions

export interface SimplifyClaimsOptions extends SimplifySnaksOptions {
  keepIds?: boolean
  keepRanks?: boolean
  keepNonTruthy?: boolean
  keepNonDeprecated?: boolean
}

export type CustomSimplifiedClaim = CustomSimplifiedSnak & {
  id?: Guid
  rank?: Rank
  qualifiers?: SimplifiedQualifiers
  references?: SimplifiedReferences
}
export type LooseCustomSimplifiedClaim = CustomSimplifiedSnak & {
  id?: Guid
  rank?: Rank
  qualifiers?: LooseSimplifiedQualifiers
  references?: LooseSimplifiedReferences
}

export type SimplifiedPropertyClaims = SimplifiedClaim[]
export type SimplifiedPropertySnaks = SimplifiedSnak[]

export type SimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims>
export type SimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks>

export type LooseSimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims | SimplifiedClaim>
export type LooseSimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks | SimplifiedSnak>

export type SimplifiedQualifier = SimplifiedSnak
export type SimplifiedPropertyQualifiers = SimplifiedQualifier[]
export type SimplifiedQualifiers = Record<string, SimplifiedPropertyQualifiers>
export type LooseSimplifiedQualifiers = Record<string, SimplifiedPropertyQualifiers | SimplifiedQualifier>

export type SimplifiedReferenceSnak = SimplifiedSnak

export type SimplifiedReferenceSnaks = Record<PropertyId, SimplifiedReferenceSnak[]>
export type LooseSimplifiedReferenceSnaks = Record<PropertyId, SimplifiedReferenceSnak | SimplifiedReferenceSnak[]>

export interface RichSimplifiedReferenceSnaks {
  snaks: SimplifiedReferenceSnaks
  hash: Hash
}
export interface LooseRichSimplifiedReferenceSnaks {
  snaks: LooseSimplifiedReferenceSnaks
  hash: Hash
}

export type SimplifiedReference = SimplifiedReferenceSnaks | RichSimplifiedReferenceSnaks
export type LooseSimplifiedReference = SimplifiedReference | LooseSimplifiedReferenceSnaks | LooseRichSimplifiedReferenceSnaks

export type SimplifiedReferences = SimplifiedReference[]
export type LooseSimplifiedReferences = SimplifiedReference[] | LooseSimplifiedReference[] | LooseSimplifiedReference

export type SimplifiedSnak = string | number | CustomSimplifiedSnak | SnakDataValue['value']
export type SimplifiedClaim = string | number | CustomSimplifiedClaim | SnakDataValue['value']
export type LooseSimplifiedClaim = string | number | LooseCustomSimplifiedClaim

export interface CustomSimplifiedSnakBase {
  snaktype?: SnakType
  hash?: Hash
  type?: SnakDatatype
}

interface CustomSimplifiedCommonsMediaSnak extends CustomSimplifiedSnakBase {
  type?: 'commonsMedia'
  value: string
}
interface CustomSimplifiedEntitySchemaSnak extends CustomSimplifiedSnakBase {
  type?: 'entity-schema'
  value: EntitySchemaId
}
interface CustomSimplifiedExternalIdSnak extends CustomSimplifiedSnakBase {
  type?: 'external-id'
  value: string
}
interface CustomSimplifiedGeoShapSnak extends CustomSimplifiedSnakBase {
  type?: 'geo-shape'
  value: string
}
interface CustomSimplifiedGlobeCoordinateSnak extends CustomSimplifiedSnakBase {
  type?: 'globe-coordinate'
  value: GlobeCoordinateSnakDataValue['value'] | [ number, number ]
}
interface CustomSimplifiedLocalMediaSnak extends CustomSimplifiedSnakBase {
  type?: 'localMedia'
  value: string
}
interface CustomSimplifiedMathSnak extends CustomSimplifiedSnakBase {
  type?: 'math'
  value: string
}
interface CustomSimplifiedMonolingualTextSnak extends CustomSimplifiedSnakBase {
  type?: 'monolingualtext'
  value: MonolingualTextSnakDataValue['value'] | string
}
interface CustomSimplifiedMusicalNotationSnak extends CustomSimplifiedSnakBase {
  type?: 'musical-notation'
  value: string
}
interface CustomSimplifiedQuantitySnak extends CustomSimplifiedSnakBase {
  type?: 'quantity'
  value: QuantitySnakDataValue['value'] | number
}
interface CustomSimplifiedStringSnak extends CustomSimplifiedSnakBase {
  type?: 'string'
  value: string
}
interface CustomSimplifiedTabularDataSnak extends CustomSimplifiedSnakBase {
  type?: 'tabular-data'
  value: string
}
interface CustomSimplifiedTimeSnak extends CustomSimplifiedSnakBase {
  type?: 'time'
  value: TimeSnakDataValue['value'] | string | number
}
interface CustomSimplifiedUrlSnak extends CustomSimplifiedSnakBase {
  type?: 'url'
  value: string
}
interface CustomSimplifiedWikibaseFormSnak extends CustomSimplifiedSnakBase {
  type?: 'wikibase-form'
  value: FormId
}
interface CustomSimplifiedWikibaseItemSnak extends CustomSimplifiedSnakBase {
  type?: 'wikibase-item'
  value: ItemId
}
interface CustomSimplifiedWikibaseLexemeSnak extends CustomSimplifiedSnakBase {
  type?: 'wikibase-lexeme'
  value: LexemeId
}
interface CustomSimplifiedMediaInfoSnak extends CustomSimplifiedSnakBase {
  type?: 'mediainfo'
  value: MediaInfoId
}
interface CustomSimplifiedWikibasePropertySnak extends CustomSimplifiedSnakBase {
  type?: 'wikibase-property'
  value: PropertyId
}
interface CustomSimplifiedWikibaseSenseSnak extends CustomSimplifiedSnakBase {
  type?: 'wikibase-sense'
  value: SenseId
}

interface CustomSimplifiedSnakByDatatype {
  commonsMedia: CustomSimplifiedCommonsMediaSnak
  'entity-schema': CustomSimplifiedEntitySchemaSnak
  'external-id': CustomSimplifiedExternalIdSnak
  'geo-shape': CustomSimplifiedGeoShapSnak
  'globe-coordinate': CustomSimplifiedGlobeCoordinateSnak
  localMedia: CustomSimplifiedLocalMediaSnak
  math: CustomSimplifiedMathSnak
  mediainfo: CustomSimplifiedMediaInfoSnak
  monolingualtext: CustomSimplifiedMonolingualTextSnak
  'musical-notation': CustomSimplifiedMusicalNotationSnak
  quantity: CustomSimplifiedQuantitySnak
  string: CustomSimplifiedStringSnak
  'tabular-data': CustomSimplifiedTabularDataSnak
  time: CustomSimplifiedTimeSnak
  url: CustomSimplifiedUrlSnak
  'wikibase-form': CustomSimplifiedWikibaseFormSnak
  'wikibase-item': CustomSimplifiedWikibaseItemSnak
  'wikibase-lexeme': CustomSimplifiedWikibaseLexemeSnak
  'wikibase-property': CustomSimplifiedWikibasePropertySnak
  'wikibase-sense': CustomSimplifiedWikibaseSenseSnak
}

export type CustomSimplifiedSnak = CustomSimplifiedSnakByDatatype[keyof CustomSimplifiedSnakByDatatype]

export interface CustomSimplifiedSnakValueByDatavalueType {
  globecoordinate: CustomSimplifiedGlobeCoordinateSnak['value']
  monolingualtext: CustomSimplifiedMonolingualTextSnak['value']
  quantity: CustomSimplifiedQuantitySnak['value']
  string: string
  time: CustomSimplifiedTimeSnak['value']
  'wikibase-entityid': EntityId
}
