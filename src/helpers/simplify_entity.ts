import { simplifyClaims } from './simplify_claims.js'
import { simplifyForms } from './simplify_forms.js'
import { simplifySenses } from './simplify_senses.js'
import { simplifySitelinks } from './simplify_sitelinks.js'
import { simplifyAliases, simplifyDescriptions, simplifyLabels, simplifyLemmas } from './simplify_text_attributes.js'
import type { Entities, Entity, SimplifiedEntity } from '../types/entity.js'
import type { SimplifyEntityOptions } from '../types/options.js'

const simplify = {
  labels: simplifyLabels,
  descriptions: simplifyDescriptions,
  aliases: simplifyAliases,
  claims: simplifyClaims,
  sitelinks: simplifySitelinks,
  lemmas: simplifyLemmas,
  forms: simplifyForms,
  senses: simplifySenses,
}

export const simplifyEntity = (entity: Entity, options: SimplifyEntityOptions = {}): SimplifiedEntity => {
  const { type } = entity
  const simplified: any = {
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
  } else if (type === 'property') {
    simplified.datatype = entity.datatype
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'claims', options)
  } else if (type === 'lexeme') {
    simplifyIfDefined(entity, simplified, 'lemmas')
    simplified.lexicalCategory = entity.lexicalCategory
    simplified.language = entity.language
    simplifyIfDefined(entity, simplified, 'claims', options)
    simplifyIfDefined(entity, simplified, 'forms', options)
    simplifyIfDefined(entity, simplified, 'senses', options)
  }

  return simplified
}

const simplifyIfDefined = (entity, simplified, attribute, options?) => {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute], options)
  }
}

export const simplifyEntities = (entities: Entities, options: SimplifyEntityOptions = {}) => {
  // @ts-expect-error
  if (entities.entities) entities = entities.entities
  const { entityPrefix } = options

  // TODO: key as string is only a best effort.
  // key is either EntityID or `${prefix}:${EntityId}` based on options.entityPrefix
  const result: Record<string, SimplifiedEntity> = {}

  for (const [ key, entity ] of Object.entries(entities)) {
    const resultKey = entityPrefix ? `${entityPrefix}:${key}` : key
    result[resultKey] = simplifyEntity(entity, options)
  }

  return result
}
