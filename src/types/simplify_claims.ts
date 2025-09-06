import type { Rank, SnakType } from './claim.js'
import type { EntityId, EntitySchemaId, FormId, Guid, Hash, ItemId, LexemeId, MediaInfoId, PropertyId, SenseId } from './entity.js'
import type { GlobeCoordinateSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, SnakDataValue, TimeSnakDataValue } from './snakvalue.js'
import type { Datatype, timeConverters } from '../helpers/parse_snak.js'
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

export type SimplifiedPropertyClaims = SimplifiedClaim[]
export type SimplifiedPropertySnaks = SimplifiedSnak[]

export type SimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims>
export type SimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks>

export type SimplifiedQualifier = SimplifiedSnak
export type SimplifiedPropertyQualifiers = SimplifiedQualifier[]
export type SimplifiedQualifiers = Record<string, SimplifiedPropertyQualifiers>

export type SimplifiedReferenceSnak = SimplifiedSnak

export type SimplifiedReferenceSnaks = Record<PropertyId, SimplifiedReferenceSnak[]>

export interface RichSimplifiedReferenceSnaks {
  snaks: SimplifiedReferenceSnaks
  hash: Hash
}

export type SimplifiedReference = SimplifiedReferenceSnaks | RichSimplifiedReferenceSnaks

export type SimplifiedReferences = SimplifiedReference[]

export type SimplifiedSnak = string | number | CustomSimplifiedSnak | SnakDataValue['value']
export type SimplifiedClaim = string | number | CustomSimplifiedClaim | SnakDataValue['value']

export interface CustomSimplifiedSnakBase {
  snaktype?: SnakType
  hash?: Hash
  datatype?: Datatype
}

export interface CustomSimplifiedCommonsMediaSnak extends CustomSimplifiedSnakBase {
  datatype?: 'commonsMedia'
  value: string
}
export interface CustomSimplifiedEdtfSnak extends CustomSimplifiedSnakBase {
  datatype?: 'edtf'
  value: string
}
export interface CustomSimplifiedEntitySchemaSnak extends CustomSimplifiedSnakBase {
  datatype?: 'entity-schema'
  value: EntitySchemaId
}
export interface CustomSimplifiedExternalIdSnak extends CustomSimplifiedSnakBase {
  datatype?: 'external-id'
  value: string
}
export interface CustomSimplifiedGeoShapSnak extends CustomSimplifiedSnakBase {
  datatype?: 'geo-shape'
  value: string
}
export interface CustomSimplifiedGlobeCoordinateSnak extends CustomSimplifiedSnakBase {
  datatype?: 'globe-coordinate'
  value: GlobeCoordinateSnakDataValue['value'] | [ number, number ]
}
export interface CustomSimplifiedLocalMediaSnak extends CustomSimplifiedSnakBase {
  datatype?: 'localMedia'
  value: string
}
export interface CustomSimplifiedMathSnak extends CustomSimplifiedSnakBase {
  datatype?: 'math'
  value: string
}
export interface CustomSimplifiedMonolingualTextSnak extends CustomSimplifiedSnakBase {
  datatype?: 'monolingualtext'
  value: MonolingualTextSnakDataValue['value'] | string
}
export interface CustomSimplifiedMusicalNotationSnak extends CustomSimplifiedSnakBase {
  datatype?: 'musical-notation'
  value: string
}
export interface CustomSimplifiedQuantitySnak extends CustomSimplifiedSnakBase {
  datatype?: 'quantity'
  value: QuantitySnakDataValue['value'] | number
}
export interface CustomSimplifiedStringSnak extends CustomSimplifiedSnakBase {
  datatype?: 'string'
  value: string
}
export interface CustomSimplifiedTabularDataSnak extends CustomSimplifiedSnakBase {
  datatype?: 'tabular-data'
  value: string
}
export interface CustomSimplifiedTimeSnak extends CustomSimplifiedSnakBase {
  datatype?: 'time'
  value: TimeSnakDataValue['value'] | string | number
}
export interface CustomSimplifiedUrlSnak extends CustomSimplifiedSnakBase {
  datatype?: 'url'
  value: string
}
export interface CustomSimplifiedWikibaseFormSnak extends CustomSimplifiedSnakBase {
  datatype?: 'wikibase-form'
  value: FormId
}
export interface CustomSimplifiedWikibaseItemSnak extends CustomSimplifiedSnakBase {
  datatype?: 'wikibase-item'
  value: ItemId
}
export interface CustomSimplifiedWikibaseLexemeSnak extends CustomSimplifiedSnakBase {
  datatype?: 'wikibase-lexeme'
  value: LexemeId
}
export interface CustomSimplifiedMediaInfoSnak extends CustomSimplifiedSnakBase {
  datatype?: 'mediainfo'
  value: MediaInfoId
}
export interface CustomSimplifiedWikibasePropertySnak extends CustomSimplifiedSnakBase {
  datatype?: 'wikibase-property'
  value: PropertyId
}
export interface CustomSimplifiedWikibaseSenseSnak extends CustomSimplifiedSnakBase {
  datatype?: 'wikibase-sense'
  value: SenseId
}

export interface CustomSimplifiedSnakByDatatype {
  commonsMedia: CustomSimplifiedCommonsMediaSnak
  edtf: CustomSimplifiedEdtfSnak
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
