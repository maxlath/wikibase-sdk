import type { Claims, DataType } from './claim.js'
import type { TypedKeyDictionnary } from './helper.js'
import type { Forms, Senses, SimplifiedForms, SimplifiedSenses } from './lexeme.js'
import type { SimplifiedClaims } from './simplify_claims.js'
import type { SimplifiedSitelinks, Sitelinks } from './sitelinks.js'
import type { Aliases, Descriptions, Labels, Lemmas, SimplifiedAliases, SimplifiedDescriptions, SimplifiedLabels, SimplifiedLemmas } from './terms.js'

export type EntityType = 'item' | 'property' | 'lexeme' | 'form' | 'sense'

export type ItemId = `Q${number}`
export type PropertyId = `P${number}`
export type LexemeId = `L${number}`
export type FormId = `L${number}-F${number}`
export type SenseId = `L${number}-S${number}`
export type EntityId = ItemId | PropertyId | LexemeId

export type NamedspacedEntityId = `${string}:${EntityId}`

export type Guid = string

export type Entity = (Property | Item | Lexeme)
export type Entities = TypedKeyDictionnary<EntityId, Entity>

export interface Property extends EntityInfo {
  id: PropertyId,
  type: 'property',
  datatype?: DataType;
  labels?: Labels;
  descriptions?: Descriptions;
  aliases?: Aliases;
  claims?: Claims;
}

export interface Item extends EntityInfo {
  id: ItemId,
  type: 'item',
  labels?: Labels;
  descriptions?: Descriptions;
  aliases?: Aliases;
  claims?: Claims;
  sitelinks?: Sitelinks;
}

export interface Lexeme extends EntityInfo {
  id: LexemeId,
  type: 'lexeme',
  lexicalCategory: ItemId;
  language: ItemId;
  lemmas?: Lemmas;
  forms?: Forms;
  senses?: Senses;
}

export interface EntityInfo {
  pageid?: number;
  ns?: number;
  title?: string;
  lastrevid?: number;
  modified?: string;
  redirects?: { from: string, to: string };
}

export interface SimplifiedEntityInfo {
  id: EntityId;
  modified?: string;
}

export interface SimplifiedItem extends SimplifiedEntityInfo {
  type: 'item',
  labels?: SimplifiedLabels;
  descriptions?: SimplifiedDescriptions;
  aliases?: SimplifiedAliases;
  claims?: SimplifiedClaims;
  sitelinks?: SimplifiedSitelinks;
  lexicalCategory: string;
}

export interface SimplifiedProperty extends SimplifiedEntityInfo {
  type: 'item',
  datatype: DataType,
  labels?: SimplifiedLabels;
  descriptions?: SimplifiedDescriptions;
  aliases?: SimplifiedAliases;
  claims?: SimplifiedClaims;
  lexicalCategory: string;
}

export interface SimplifiedLexeme extends SimplifiedEntityInfo {
  type: 'item',
  lexicalCategory: ItemId;
  language: ItemId;
  lemmas?: SimplifiedLemmas;
  forms?: SimplifiedForms;
  senses?: SimplifiedSenses;
}

export type SimplifiedEntity = SimplifiedProperty | SimplifiedItem | SimplifiedLexeme
