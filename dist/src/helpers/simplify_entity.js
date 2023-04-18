import * as simplify from './simplify.js';
export const simplifyEntity = (entity, options = {}) => {
    const { type } = entity;
    const simplified = {
        id: entity.id,
        type,
        modified: entity.modified,
    };
    if (type === 'item') {
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'aliases');
        simplifyIfDefined(entity, simplified, 'claims', options);
        simplifyIfDefined(entity, simplified, 'sitelinks', options);
    }
    else if (type === 'property') {
        simplified.datatype = entity.datatype;
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'aliases');
        simplifyIfDefined(entity, simplified, 'claims', options);
    }
    else if (type === 'lexeme') {
        simplifyIfDefined(entity, simplified, 'lemmas');
        simplified.lexicalCategory = entity.lexicalCategory;
        simplified.language = entity.language;
        simplifyIfDefined(entity, simplified, 'claims', options);
        simplifyIfDefined(entity, simplified, 'forms', options);
        simplifyIfDefined(entity, simplified, 'senses', options);
    }
    return simplified;
};
const simplifyIfDefined = (entity, simplified, attribute, options) => {
    if (entity[attribute] != null) {
        simplified[attribute] = simplify[attribute](entity[attribute], options);
    }
};
export const simplifyEntities = (entities, options = {}) => {
    // @ts-expect-error
    if (entities.entities)
        entities = entities.entities;
    const { entityPrefix } = options;
    // TODO: key as string is only a best effort.
    // key is either EntityID or `${prefix}:${EntityId}` based on options.entityPrefix
    const result = {};
    for (const [key, entity] of Object.entries(entities)) {
        const resultKey = entityPrefix ? `${entityPrefix}:${key}` : key;
        result[resultKey] = simplifyEntity(entity, options);
    }
    return result;
};
//# sourceMappingURL=simplify_entity.js.map