import type { DataType, Rank } from './claim.js';
import type { Guid, PropertyId } from './entity.js';
import type { timeConverters } from '../helpers/parse_claim.js';
export interface SimplifySnakOptions {
    entityPrefix?: string;
    propertyPrefix?: string;
    keepRichValues?: boolean;
    keepTypes?: boolean;
    keepQualifiers?: boolean;
    keepReferences?: boolean;
    keepIds?: boolean;
    keepHashes?: boolean;
    keepRanks?: boolean;
    keepSnaktypes?: boolean;
    keepAll?: boolean;
    timeConverter?: keyof typeof timeConverters;
    novalueValue?: any;
    somevalueValue?: any;
}
export interface SimplifySnaksOptions extends SimplifySnakOptions {
    keepNonTruthy?: boolean;
    keepNonDeprecated?: boolean;
}
export type SimplifyClaimsOptions = SimplifySnaksOptions;
export interface CustomSimplifiedClaim extends CustomSimplifiedSnak {
    id: Guid;
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
export interface SimplifiedReference {
    [property: string]: SimplifiedReferenceSnak;
}
export type SimplifiedReferences = SimplifiedReference[];
export type SimplifiedSnak = string | number | CustomSimplifiedSnak;
export type SimplifiedClaim = string | number | CustomSimplifiedClaim;
export interface CustomSimplifiedSnak {
    id: string;
    type?: DataType;
    value: unknown;
}
