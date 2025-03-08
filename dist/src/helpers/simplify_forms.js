import { isFormId } from './helpers.js';
import { simplifyClaims } from './simplify_claims.js';
import { simplifyRepresentations } from './simplify_text_attributes.js';
export const simplifyForm = (form, options = {}) => {
    const { id, representations, grammaticalFeatures, claims } = form;
    if (!isFormId(id))
        throw new Error('invalid form object');
    return {
        id,
        representations: simplifyRepresentations(representations),
        grammaticalFeatures,
        claims: simplifyClaims(claims, options),
    };
};
export const simplifyForms = (forms, options = {}) => forms.map(form => simplifyForm(form, options));
//# sourceMappingURL=simplify_forms.js.map