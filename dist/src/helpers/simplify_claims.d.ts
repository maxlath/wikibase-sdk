import type { Claim, PropertyQualifiers, PropertySnaks, PropertyStatementQualifiers, PropertyStatementSnaks, Qualifier, Qualifiers, Reference, Snak, Snaks, Statement, StatementQualifier, StatementQualifiers, StatementReference, StatementSnak, StatementSnaks } from '../types/claim.js';
import type { PropertyId } from '../types/entity.js';
import type { SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifiedPropertySnaks, SimplifiedSnaks, SimplifyClaimsOptions, SimplifySnakOptions, SimplifySnaksOptions } from '../types/simplify_claims.js';
/**
 * Tries to replace wikidata deep snak object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
export declare function simplifySnak(snak: Snak | StatementSnak, options?: SimplifySnakOptions): any;
export declare function simplifyClaim(claim: Claim | Statement, options?: SimplifyClaimsOptions): SimplifiedClaim;
export declare function simplifyClaims<T extends (Claim | Statement)>(claims: Record<PropertyId, T[]>, options?: SimplifyClaimsOptions): SimplifiedClaims;
export declare function simplifyPropertyClaims<T extends (Claim | Statement)>(propertyClaims: T[], options?: SimplifyClaimsOptions): SimplifiedPropertyClaims;
export declare function simplifySnaks(snaks?: Snaks | StatementSnaks, options?: SimplifySnaksOptions): SimplifiedSnaks;
export declare function simplifyPropertySnaks(propertySnaks: PropertySnaks | PropertyStatementSnaks, options?: SimplifySnaksOptions): SimplifiedPropertySnaks;
export declare function simplifyQualifiers(qualifiers: Qualifiers | StatementQualifiers, options?: SimplifySnaksOptions): SimplifiedSnaks;
export declare function simplifyPropertyQualifiers(propertyQualifiers: PropertyQualifiers | PropertyStatementQualifiers, options?: SimplifySnaksOptions): SimplifiedPropertySnaks;
export declare function simplifyQualifier(qualifier: Qualifier | StatementQualifier, options?: SimplifySnakOptions): any;
export declare function simplifyReferences(references: Reference[] | StatementReference[], options?: SimplifySnaksOptions): (SimplifiedSnaks | {
    snaks: SimplifiedSnaks;
    hash: string;
})[];
export declare function simplifyReference(reference: Reference | StatementReference, options?: SimplifySnaksOptions): SimplifiedSnaks | {
    snaks: SimplifiedSnaks;
    hash: string;
};
/** @deprecated use the new function name simplifyReference instead */
export declare const simplifyReferenceRecord: typeof simplifyReference;
//# sourceMappingURL=simplify_claims.d.ts.map