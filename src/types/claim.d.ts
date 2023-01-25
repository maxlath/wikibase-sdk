import type { Dictionary } from './helper.js'
import type { parsers } from '../helpers/parse_claim.js'

export type Rank = 'normal' | 'preferred' | 'deprecated'

export type DataType = keyof typeof parsers

export type SnakType = 'value' | 'somevalue' | 'novalue'

export interface Claim {
  id: string;
  mainsnak: Snak;
  rank: Rank;
  type: DataType;
  qualifiers?: Dictionary<Snak[]>;
  'qualifiers-order'?: string[];
  references?: Reference[];
}

export type PropertyClaims = Claim[]

export interface Claims {
  [property: string]: PropertyClaims
}

export interface Snak {
  // A mainsnak object won't have an id, as its already on the claim
  id?: string;
  datatype: string;
  datavalue?: SnakValue;
  hash: string;
  property: string;
  snaktype: SnakType;
}

export interface SnakValue {
  type: DataType;
  value: unknown;
}

export interface ClaimSnakTimeValue extends SnakValue {
  type: 'time';
  value: {
    after: number;
    before: number;
    calendermodel: string;
    precision: number;
    time: string;
    timezone: number;
  };
}

export interface SnakEntityValue extends SnakValue {
  type: 'wikibase-entityid';
  value: {
    id: string;
    'numeric-id': number;
    'entity-type': string;
  };
}

export interface Qualifier extends Snak {
  id: string;
}

export type PropertyQualifiers = Qualifier[]

export interface Qualifiers {
  [property: string]: PropertyQualifiers
}

export interface ReferenceSnak extends Snak {
  id: string;
}

export interface Reference {
  hash: string;
  snaks: Dictionary<ReferenceSnak[]>;
  'snaks-order': string[];
}
