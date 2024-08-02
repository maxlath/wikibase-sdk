import type { Claim, Claims, PropertyClaims, PropertyQualifiers, PropertySnaks, Qualifier, Qualifiers, Reference, Snak, Snaks } from '../types/claim.js';
import type { SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifiedPropertySnaks, SimplifiedSnaks, SimplifyClaimsOptions, SimplifySnakOptions, SimplifySnaksOptions } from '../types/simplify_claims.js';
/**
 * Tries to replace wikidata deep snak object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
export declare function simplifySnak(snak: Snak, options?: SimplifySnakOptions): any;
export declare function simplifyClaim(claim: Claim, options?: SimplifySnakOptions): SimplifiedClaim;
export declare function simplifyClaims(claims: Claims, options?: SimplifyClaimsOptions): SimplifiedClaims;
export declare function simplifyPropertyClaims(propertyClaims: PropertyClaims, options?: SimplifyClaimsOptions): SimplifiedPropertyClaims;
export declare function simplifySnaks(snaks?: Snaks, options?: SimplifySnaksOptions): SimplifiedSnaks;
export declare function simplifyPropertySnaks(propertySnaks: PropertySnaks, options?: SimplifySnaksOptions): SimplifiedPropertySnaks;
export declare function simplifyQualifiers(qualifiers: Qualifiers, options?: SimplifySnaksOptions): SimplifiedSnaks;
export declare function simplifyPropertyQualifiers(propertyQualifiers: PropertyQualifiers, options?: SimplifySnaksOptions): SimplifiedPropertySnaks;
export declare function simplifyQualifier(qualifier: Qualifier, options?: SimplifySnakOptions): any;
export declare function simplifyReferences(references: readonly Reference[], options?: SimplifySnaksOptions): (SimplifiedSnaks | {
    snaks: SimplifiedSnaks;
    hash: string;
})[];
export declare function simplifyReference(reference: Reference, options?: SimplifySnaksOptions): SimplifiedSnaks | {
    snaks: SimplifiedSnaks;
    hash: string;
};
/** @deprecated use the new function name simplifyReference instead */
export declare const simplifyReferenceRecord: typeof simplifyReference;
//# sourceMappingURL=simplify_claims.d.ts.map