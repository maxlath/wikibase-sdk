import type { DataType, Rank, SnakType } from './claim.js';
import type { Guid, Hash, PropertyId } from './entity.js';
import type { timeConverters } from '../helpers/parse_snak.js';
import type { TimeConverter } from '../helpers/time.js';
export interface SimplifySnakOptions {
    entityPrefix?: string;
    propertyPrefix?: string;
    keepRichValues?: boolean;
    keepTypes?: boolean;
    keepQualifiers?: boolean;
    keepReferences?: boolean;
    keepHashes?: boolean;
    keepSnaktypes?: boolean;
    keepAll?: boolean;
    timeConverter?: keyof typeof timeConverters | TimeConverter<unknown>;
    novalueValue?: unknown;
    somevalueValue?: unknown;
    minTimePrecision?: number;
}
export type SimplifySnaksOptions = SimplifySnakOptions;
export interface SimplifyClaimsOptions extends SimplifySnaksOptions {
    keepIds?: boolean;
    keepRanks?: boolean;
    keepNonTruthy?: boolean;
    keepNonDeprecated?: boolean;
}
export interface CustomSimplifiedClaim extends CustomSimplifiedSnak {
    id?: Guid;
    rank?: Rank;
    qualifiers?: SimplifiedQualifiers;
    references?: SimplifiedReferences;
}
export type SimplifiedPropertyClaims = SimplifiedClaim[];
export type SimplifiedPropertySnaks = SimplifiedSnak[];
export type SimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims>;
export type SimplifiedSnaks = Record<PropertyId, SimplifiedPropertySnaks>;
export type SimplifiedQualifier = SimplifiedSnak;
export type SimplifiedPropertyQualifiers = SimplifiedQualifier[];
export interface SimplifiedQualifiers {
    [property: string]: SimplifiedPropertyQualifiers;
}
export type SimplifiedReferenceSnak = SimplifiedSnak;
export type SimplifiedReferenceSnaks = Record<PropertyId, SimplifiedReferenceSnak[]>;
export interface RichSimplifiedReferenceSnaks {
    snaks: SimplifiedReferenceSnaks;
    hash: Hash;
}
export type SimplifiedReference = SimplifiedReferenceSnaks | RichSimplifiedReferenceSnaks;
export type SimplifiedReferences = SimplifiedReference[];
export type SimplifiedSnak = string | number | CustomSimplifiedSnak;
export type SimplifiedClaim = string | number | CustomSimplifiedClaim;
export interface CustomSimplifiedSnak {
    type?: DataType;
    value: unknown;
    snaktype?: SnakType;
    hash?: Hash;
}
//# sourceMappingURL=simplify_claims.d.ts.map