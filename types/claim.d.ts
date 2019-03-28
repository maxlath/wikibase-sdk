import {Dictionary} from './helper'

export type ClaimRank = 'normal' | 'preferred' | 'deprecated'

export type ClaimSimplified = unknown;
export type ClaimSnakSimplified = unknown;

export interface Claim {
	id: string;
	mainsnak: ClaimSnak;
	rank: ClaimRank;
	type: string;
	qualifiers?: Dictionary<ClaimSnak[]>;
	'qualifiers-order'?: string[];
	references?: ClaimReference[];
}

export interface ClaimSnak {
	datatype: string;
	datavalue?: ClaimSnakValue;
	hash: string;
	property: string;
	snaktype: string;
}

export interface ClaimSnakValue {
	type: string;
	value: unknown;
}

export interface ClaimSnakTimeValue extends ClaimSnakValue {
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

export interface ClaimSnakEntityValue extends ClaimSnakValue {
	type: 'wikibase-entityid';
	value: {
		id: string;
		'numeric-id': number;
		'entity-type': string;
	};
}

export interface ClaimReference {
	hash: string;
	snaks: Dictionary<ClaimSnak[]>;
	'snaks-order': string[];
}
