const simplify = require('./simplify')

const simplifyEntity = (entity, options) => {
  const simplified = {
    id: entity.id,
    type: entity.type,
    modified: entity.modified
  }

  if (entity.datatype) simplified.datatype = entity.datatype

  if (entity.type === 'item' || entity.type === 'property') {
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'sitelinks', options)
  } else if (entity.type === 'lexeme') {
    simplified.lexicalCategory = entity.lexicalCategory
    simplified.language = entity.language
    simplifyIfDefined(entity, simplified, 'lemmas')
    simplifyIfDefined(entity, simplified, 'forms', options)
    simplifyIfDefined(entity, simplified, 'senses', options)
  }

  simplifyIfDefined(entity, simplified, 'claims', options)

  return simplified
}

const simplifyIfDefined = (entity, simplified, attribute, options) => {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute], options)
  }
}

const simplifyEntities = (entities, options = {}) => {
  if (entities.entities) entities = entities.entities
  const { entityPrefix } = options
  return Object.keys(entities).reduce((obj, key) => {
    const entity = entities[key]
    if (entityPrefix) key = `${entityPrefix}:${key}`
    obj[key] = simplifyEntity(entity, options)
    return obj
  }, {})
}

// Set those here instead of in ./simplify to avoid a circular dependency
simplify.entity = simplifyEntity
simplify.entities = simplifyEntities

module.exports = { simplifyEntity, simplifyEntities }
