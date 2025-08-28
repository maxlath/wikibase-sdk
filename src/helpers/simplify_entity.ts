import { simplifyClaims } from './simplify_claims.js'
import { simplifyForms } from './simplify_forms.js'
import { simplifySenses } from './simplify_senses.js'
import { simplifySitelinks } from './simplify_sitelinks.js'
import { simplifyAliases, simplifyDescriptions, simplifyLabels, simplifyLemmas } from './simplify_text_attributes.js'
import type { Entities, Entity, Item, Lexeme, MediaInfo, Property, SimplifiedEntity, SimplifiedItem, SimplifiedLexeme, SimplifiedMediaInfo, SimplifiedProperty } from '../types/entity.js'
import type { SimplifyEntityOptions } from '../types/options.js'

const simplify = {
  labels: simplifyLabels,
  descriptions: simplifyDescriptions,
  aliases: simplifyAliases,
  claims: simplifyClaims,
  statements: simplifyClaims,
  sitelinks: simplifySitelinks,
  lemmas: simplifyLemmas,
  forms: simplifyForms,
  senses: simplifySenses,
}

export function simplifyEntity (entity: Item, options?: SimplifyEntityOptions): SimplifiedItem
export function simplifyEntity (entity: Property, options?: SimplifyEntityOptions): SimplifiedProperty
export function simplifyEntity (entity: Lexeme, options?: SimplifyEntityOptions): SimplifiedLexeme
export function simplifyEntity (entity: MediaInfo, options?: SimplifyEntityOptions): SimplifiedMediaInfo
export function simplifyEntity (entity: Entity, options: SimplifyEntityOptions = {}): SimplifiedEntity {
  const { type } = entity
  if (!type) throw new Error('missing entity type')

  const simplified = {
    id: entity.id,
    type,
    modified: entity.modified,
  }

  if (type === 'item') {
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'claims', options)
    simplifyIfDefined(entity, simplified, 'sitelinks', options)
    return simplified as SimplifiedItem
  } else if (type === 'property') {
    // @ts-expect-error
    simplified.datatype = entity.datatype
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'claims', options)
    return simplified as SimplifiedProperty
  } else if (type === 'lexeme') {
    simplifyIfDefined(entity, simplified, 'lemmas')
    // @ts-expect-error
    simplified.lexicalCategory = entity.lexicalCategory
    // @ts-expect-error
    simplified.language = entity.language
    simplifyIfDefined(entity, simplified, 'claims', options)
    simplifyIfDefined(entity, simplified, 'forms', options)
    simplifyIfDefined(entity, simplified, 'senses', options)
    return simplified as SimplifiedLexeme
  } else if (type === 'mediainfo') {
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'statements', options)
    return simplified as SimplifiedMediaInfo
  }

  throw new Error(`unsupported entity type: ${type}`)
}

function simplifyIfDefined (entity, simplified, attribute, options?) {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute], options)
  }
}

export function simplifyEntities (entities: Entities, options: SimplifyEntityOptions = {}) {
  // @ts-expect-error support downloaded json directly
  if (entities.entities) entities = entities.entities
  const { entityPrefix } = options

  // TODO: key as string is only a best effort.
  // key is either EntityID or `${prefix}:${EntityId}` based on options.entityPrefix
  const result: Record<string, SimplifiedEntity> = {}

  for (const [ key, entity ] of Object.entries(entities)) {
    const resultKey = entityPrefix ? `${entityPrefix}:${key}` : key
    // @ts-expect-error
    result[resultKey] = simplifyEntity(entity, options)
  }

  return result
}
