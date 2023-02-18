import { simplify } from './simplify.js';
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
    return Object.keys(entities).reduce((obj, key) => {
        const entity = entities[key];
        if (entityPrefix)
            key = `${entityPrefix}:${key}`;
        obj[key] = simplifyEntity(entity, options);
        return obj;
    }, {});
};
// Set those here instead of in ./simplify to avoid a circular dependency
// @ts-expect-error
simplify.entity = simplifyEntity;
// @ts-expect-error
simplify.entities = simplifyEntities;
//# sourceMappingURL=simplify_entity.js.map