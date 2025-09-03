import type { Claims, DataType, Statements } from './claim.js'
import type { Form, Sense, SimplifiedForm, SimplifiedForms, SimplifiedSense, SimplifiedSenses } from './lexeme.js'
import type { LooseSimplifiedClaims, SimplifiedClaims } from './simplify_claims.js'
import type { SimplifiedSitelinks, Sitelinks } from './sitelinks.js'
import type { Aliases, Descriptions, Labels, Lemmas, LooseSimplifiedAliases, SimplifiedAliases, SimplifiedDescriptions, SimplifiedLabels, SimplifiedLemmas } from './terms.js'
import type { OverrideProperties } from 'type-fest'

export const EntityTypes = [
  'item',
  'property',
  'lexeme',
  'form',
  'sense',
  'entity-schema',
  'mediainfo',
] as const

export type EntityType = typeof EntityTypes[number]

export type NumericId = `${number}`
export type ItemId = `Q${number}`
export type PropertyId = `P${number}`
export type LexemeId = `L${number}`
export type FormId = `L${number}-F${number}`
export type SenseId = `L${number}-S${number}`
export type EntitySchemaId = `E${number}`
export type MediaInfoId = `M${number}`
export type RevisionId = `${number}`

export type PropertyClaimsId = `${EntityId}#${PropertyId}`

export type NonNestedEntityId = ItemId | PropertyId | LexemeId | MediaInfoId | EntitySchemaId
export type EntityId = NonNestedEntityId | FormId | SenseId
export type NamespacedEntityId = `Item:${ItemId}` | `Lexeme:${LexemeId}` | `Property:${PropertyId}` | `EntitySchema:${EntitySchemaId}`

export interface EntityIdByEntityType {
  'entity-schema': EntitySchemaId
  form: FormId
  item: ItemId
  lexeme: LexemeId
  mediainfo: MediaInfoId
  property: PropertyId
  sense: SenseId
}

export type Guid <T extends EntityWithClaims['id'] = EntityWithClaims['id']> = `${T | Lowercase<T>}$${string}`
/**
 * A more shell-friendly GUID syntax, with a "-" instead of a "$"
 */
export type GuidAltSyntax <T extends EntityWithClaims['id'] = EntityWithClaims['id']> = `${T | Lowercase<T>}-${string}`

export type Hash = string

export type Entity = Property | Item | Lexeme | Form | Sense | MediaInfo
export type EntityPageTitle = NamespacedEntityId | ItemId
export type Entities = Record<EntityId, Entity>

export interface Property extends EntityInfo<PropertyId> {
  type: 'property'
  datatype?: DataType
  labels?: Labels
  descriptions?: Descriptions
  aliases?: Aliases
  claims?: Claims
}

export interface Item extends EntityInfo<ItemId> {
  type: 'item'
  labels?: Labels
  descriptions?: Descriptions
  aliases?: Aliases
  claims?: Claims
  sitelinks?: Sitelinks
}

export interface Lexeme extends EntityInfo<LexemeId> {
  type: 'lexeme'
  lexicalCategory: ItemId
  language: ItemId
  claims?: Claims
  lemmas?: Lemmas
  forms?: Form[]
  senses?: Sense[]
}

export interface MediaInfo extends EntityInfo<MediaInfoId> {
  type: 'mediainfo'
  labels?: Labels
  descriptions?: Descriptions
  statements?: Statements
}

export interface EntityInfo<T> {
  pageid?: number
  ns?: number
  title?: string
  lastrevid?: number
  modified?: string
  redirects?: { from: T, to: T }
  id: T
}

export interface SimplifiedEntityInfo <ID extends EntityId> {
  id: ID
  modified?: string
}

export interface SimplifiedItem extends SimplifiedEntityInfo<ItemId> {
  type: 'item'
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  aliases?: SimplifiedAliases
  claims?: SimplifiedClaims
  sitelinks?: SimplifiedSitelinks
  lexicalCategory: string
}

export type LooseSimplifiedItem = OverrideProperties<SimplifiedItem, {
  aliases?: LooseSimplifiedAliases
  claims?: LooseSimplifiedClaims
}>

export interface SimplifiedProperty extends SimplifiedEntityInfo<PropertyId> {
  type: 'property'
  datatype: DataType
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  aliases?: SimplifiedAliases
  claims?: SimplifiedClaims
  lexicalCategory: string
}
export type LooseSimplifiedProperty = OverrideProperties<SimplifiedProperty, {
  aliases?: LooseSimplifiedAliases
  claims?: LooseSimplifiedClaims
}>

export interface SimplifiedLexeme extends SimplifiedEntityInfo<LexemeId> {
  type: 'lexeme'
  lexicalCategory: ItemId
  language: ItemId
  claims?: SimplifiedClaims
  lemmas?: SimplifiedLemmas
  forms?: SimplifiedForms
  senses?: SimplifiedSenses
}
export type LooseSimplifiedLexeme = OverrideProperties<SimplifiedLexeme, {
  claims?: LooseSimplifiedClaims
}>

export interface SimplifiedMediaInfo extends SimplifiedEntityInfo<MediaInfoId> {
  type: 'mediainfo'
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  statements?: SimplifiedClaims
}
export type LooseSimplifiedMediaInfo = OverrideProperties<SimplifiedMediaInfo, {
  statements?: LooseSimplifiedClaims
}>

export type SimplifiedEntity = SimplifiedProperty | SimplifiedItem | SimplifiedLexeme | SimplifiedForm | SimplifiedSense | SimplifiedMediaInfo
export type LooseSimplifiedEntity = LooseSimplifiedProperty | LooseSimplifiedItem | LooseSimplifiedLexeme | LooseSimplifiedMediaInfo
export type SimplifiedEntities = Record<EntityId, SimplifiedEntity>

export type EntityWithClaims = Item | Property | Lexeme | Form | Sense | MediaInfo
export type EntityWithSitelinks = Item
