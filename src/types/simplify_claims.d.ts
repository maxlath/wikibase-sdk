import type { DataType, Rank } from './claim.js'
import type { timeConverters } from '../helpers/parse_claim.js'

export interface SimplifySnakOptions {
  entityPrefix?: string | null;
  propertyPrefix?: string | null;
  keepRichValues?: boolean;
  keepTypes?: boolean;
  keepQualifiers?: boolean;
  keepReferences?: boolean;
  keepIds?: boolean;
  keepHashes?: boolean;
  keepRanks?: boolean;
  keepSnaktypes?: boolean;
  timeConverter?: keyof typeof timeConverters;
  novalueValue?: any;
  somevalueValue?: any;
}

export interface SimplifySnaksOptions extends SimplifySnakOptions {
  keepNonTruthy?: boolean;
  keepNonDeprecated?: boolean;
}

export interface SimplifiedClaim extends SimplifiedSnak {
  id: string;
  type?: DataType;
  rank?: Rank;
  value: unknown;
  qualifiers?: SimplifiedQualifiers;
  references?: SimplifiedReferences;
}
export type SimplifiedPropertyClaims = SimplifiedClaim[]
export interface SimplifiedClaims {
  [property: string]: SimplifiedPropertyClaims
}

export type SimplifiedQualifier = SimplifiedSnak
export type SimplifiedPropertyQualifiers = SimplifiedQualifier[]
export interface SimplifiedQualifiers {
  [property: string]: SimplifiedPropertyQualifiers
}

export type SimplifiedReferenceSnak = SimplifiedSnak
export interface SimplifiedReference {
  [property: string]: SimplifiedReferenceSnak
}
export type SimplifiedReferences = SimplifiedReference[]

export type SimplifiedSnak = string | RichSimplifiedSnak

export interface RichSimplifiedSnak {
  id: string;
  type?: DataType;
  value: unknown;
}
