import { isFormId, isSenseId } from './helpers.js';
import { simplifyClaims } from './simplify_claims.js';
import { simplifyForms } from './simplify_forms.js';
import { simplifySenses } from './simplify_senses.js';
import { simplifySitelinks } from './simplify_sitelinks.js';
import { simplifyAliases, simplifyDescriptions, simplifyGlosses, simplifyLabels, simplifyLemmas, simplifyRepresentations } from './simplify_text_attributes.js';
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
    representations: simplifyRepresentations,
    glosses: simplifyGlosses,
};
export function simplifyEntity(entity, options = {}) {
    let { id } = entity;
    let type;
    if ('type' in entity) {
        type = entity.type;
    }
    else if (isFormId(id)) {
        type = 'form';
    }
    else if (isSenseId(id)) {
        type = 'sense';
    }
    else {
        throw new Error('missing entity type');
    }
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
        return simplified;
    }
    else if (type === 'property') {
        // @ts-expect-error
        simplified.datatype = entity.datatype;
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'aliases');
        simplifyIfDefined(entity, simplified, 'claims', options);
        return simplified;
    }
    else if (type === 'lexeme') {
        simplifyIfDefined(entity, simplified, 'lemmas');
        // @ts-expect-error
        simplified.lexicalCategory = entity.lexicalCategory;
        // @ts-expect-error
        simplified.language = entity.language;
        simplifyIfDefined(entity, simplified, 'claims', options);
        simplifyIfDefined(entity, simplified, 'forms', options);
        simplifyIfDefined(entity, simplified, 'senses', options);
        return simplified;
    }
    else if (type === 'form') {
        // @ts-expect-error
        simplified.grammaticalFeatures = entity.grammaticalFeatures;
        simplifyIfDefined(entity, simplified, 'representations', options);
        simplifyIfDefined(entity, simplified, 'claims', options);
        return simplified;
    }
    else if (type === 'sense') {
        simplifyIfDefined(entity, simplified, 'glosses', options);
        simplifyIfDefined(entity, simplified, 'claims', options);
        return simplified;
    }
    else if (type === 'mediainfo') {
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'statements', options);
        return simplified;
    }
    throw new Error(`unsupported entity type: ${type}`);
}
function simplifyIfDefined(entity, simplified, attribute, options) {
    if (entity[attribute] != null) {
        simplified[attribute] = simplify[attribute](entity[attribute], options);
    }
}
export function simplifyEntities(entities, options = {}) {
    // @ts-expect-error support downloaded json directly
    if (entities.entities)
        entities = entities.entities;
    const { entityPrefix } = options;
    // TODO: key as string is only a best effort.
    // key is either EntityID or `${prefix}:${EntityId}` based on options.entityPrefix
    const result = {};
    for (const [key, entity] of Object.entries(entities)) {
        const resultKey = entityPrefix ? `${entityPrefix}:${key}` : key;
        // @ts-expect-error
        result[resultKey] = simplifyEntity(entity, options);
    }
    return result;
}
//# sourceMappingURL=simplify_entity.js.map