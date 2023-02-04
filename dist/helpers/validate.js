import { isEntityId, isEntityPageTitle, isPropertyId, isRevisionId } from './helpers.js';
const validate = (name, testFn) => value => {
    if (!testFn(value))
        throw new Error(`invalid ${name}: ${value}`);
};
export default {
    entityId: validate('entity id', isEntityId),
    propertyId: validate('property id', isPropertyId),
    entityPageTitle: validate('entity page title', isEntityPageTitle),
    revisionId: validate('revision id', isRevisionId),
};
