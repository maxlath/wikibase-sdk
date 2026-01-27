import { isEntityId, isEntityPageTitle, isPropertyId, isRevisionId } from './helpers.js';
/** Ensure both via TypeScript and at runtime that the input value is of the expected type. Throws error when it is not */
function validate(name, testFn) {
    return function (value) {
        if (!testFn(value))
            throw new Error(`invalid ${name}: ${value} (type: ${typeOf(value)})`);
    };
}
export const entityId = validate('entity id', isEntityId);
export const propertyId = validate('property id', isPropertyId);
export const entityPageTitle = validate('entity page title', isEntityPageTitle);
export const revisionId = validate('revision id', isRevisionId);
function typeOf(value) {
    // just handling what differes from typeof
    const type = typeof value;
    if (type === 'object') {
        if (value === null)
            return 'null';
        if (value instanceof Array)
            return 'array';
        if (value instanceof Promise)
            return 'promise';
    }
    if (type === 'number') {
        if (Number.isNaN(value))
            return 'NaN';
    }
    return type;
}
//# sourceMappingURL=validate.js.map