import * as simplify from './simplify.js'
import type { Entities, Entity, SimplifiedEntity, SimplifiedItem, SimplifiedProperty, SimplifiedLexeme } from '../types/entity.js'
import type { SimplifyEntityOptions } from '../types/options.js'

export const simplifyEntity = (entity: Entity, options: SimplifyEntityOptions = {}): SimplifiedEntity => {
  const { id, modified, type } = entity
  if (type === 'item') {
    const simplified: SimplifiedItem = { id, type, modified }

    if (entity.labels != null) simplified.labels = simplify.labels(entity.labels)
    if (entity.descriptions != null) simplified.descriptions = simplify.descriptions(entity.descriptions)
    if (entity.aliases != null) simplified.aliases = simplify.aliases(entity.aliases)
    if (entity.claims != null) simplified.claims = simplify.claims(entity.claims, options)
    if (entity.sitelinks != null) simplified.sitelinks = simplify.sitelinks(entity.sitelinks, options)

    return simplified
  } else if (type === 'property') {
    const simplified: SimplifiedProperty = { id, type, modified, datatype: entity.datatype }

    if (entity.labels != null) simplified.labels = simplify.labels(entity.labels)
    if (entity.descriptions != null) simplified.descriptions = simplify.descriptions(entity.descriptions)
    if (entity.aliases != null) simplified.aliases = simplify.aliases(entity.aliases)
    if (entity.claims != null) simplified.claims = simplify.claims(entity.claims, options)

    return simplified
  } else if (type === 'lexeme') {
    const simplified: SimplifiedLexeme = { id, type, modified, lexicalCategory: entity.lexicalCategory, language: entity.language }

    if (entity.lemmas != null) simplified.lemmas = simplify.lemmas(entity.lemmas)
    if (entity.claims != null) simplified.claims = simplify.claims(entity.claims, options)
    if (entity.forms != null) simplified.forms = simplify.forms(entity.forms, options)
    if (entity.senses != null) simplified.senses = simplify.senses(entity.senses, options)

    return simplified
  }

  return { id, type, modified }
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
