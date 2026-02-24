import { isSenseId } from './helpers.js';
import { simplifyClaims } from './simplify_claims.js';
import { simplifyGlosses } from './simplify_text_attributes.js';
export function simplifySense(sense, options = {}) {
    const { id, glosses, claims } = sense;
    if (!isSenseId(id))
        throw new Error('invalid sense object');
    return {
        id,
        type: 'sense',
        glosses: simplifyGlosses(glosses),
        claims: simplifyClaims(claims, options),
    };
}
export function simplifySenses(senses, options = {}) {
    return senses.map(sense => simplifySense(sense, options));
}
//# sourceMappingURL=simplify_senses.js.map