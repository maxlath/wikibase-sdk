import type { PropertyId } from './entity.js';
import type { SnakValue } from './snakvalue.js';
import type { parsers } from '../helpers/parse_claim.js';
export type Rank = 'normal' | 'preferred' | 'deprecated';
export type SnakType = 'value' | 'somevalue' | 'novalue';
export type DataType = keyof typeof parsers;
export interface Claim {
    id: string;
    mainsnak: Snak;
    rank: Rank;
    type: 'statement';
    qualifiers?: Qualifiers;
    'qualifiers-order'?: PropertyId[];
    references?: Reference[];
}
export type PropertyClaims = Claim[];
export type PropertySnaks = Snak[];
export type Claims = Record<PropertyId, PropertyClaims>;
export type Snaks = Record<PropertyId, PropertySnaks>;
export interface Snak {
    datatype: DataType;
    datavalue?: SnakValue;
    hash: string;
    property: PropertyId;
    snaktype: SnakType;
}
export type Qualifier = Snak;
export type PropertyQualifiers = Qualifier[];
export type Qualifiers = Record<PropertyId, PropertyQualifiers>;
export type ReferenceSnak = Snak;
export interface Reference {
    hash: string;
    snaks: Record<PropertyId, ReferenceSnak[]>;
    'snaks-order': PropertyId[];
}
export type References = Reference[];
//# sourceMappingURL=claim.d.ts.map