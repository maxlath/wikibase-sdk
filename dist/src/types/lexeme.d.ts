import type { Claims } from './claim.js';
import type { FormId, ItemId, PropertyId, SenseId } from './entity.js';
import type { SimplifiedClaims } from './simplify_claims.js';
import type { Glosses, Representations, SimplifiedGlosses, SimplifiedRepresentations } from './terms.js';
export interface Form {
    id: FormId;
    representations?: Representations;
    grammaticalFeatures?: ItemId[];
    claims?: Claims;
}
export interface Sense {
    id: SenseId;
    glosses?: Glosses;
    claims?: Claims;
}
export type SimplifiedForms = Record<PropertyId, SimplifiedForm[]>;
export type SimplifiedSenses = Record<PropertyId, SimplifiedSense[]>;
export interface SimplifiedForm {
    id: FormId;
    representations?: SimplifiedRepresentations;
    grammaticalFeatures?: ItemId[];
    claims?: SimplifiedClaims;
}
export interface SimplifiedSense {
    id: SenseId;
    glosses?: SimplifiedGlosses;
    claims?: SimplifiedClaims;
}
//# sourceMappingURL=lexeme.d.ts.map