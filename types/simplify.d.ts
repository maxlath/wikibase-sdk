import {
	SimplifyClaimsOptions,
	SimplifyEntitiesOptions,
	SimplifySitelinkOptions
} from './options.d'

import {
	Claim,
	ClaimSimplified,
	ClaimSnak,
	ClaimSnakSimplified
} from './claim.d'

import {
	Entity,
	EntitySimplified,
	LanguageEntry,
	Sitelink
} from './entity.d'

import {
	SparqlValueRaw,
	SparqlValueType,
	SparqlResults
} from './sparql.d'

export function labels(data: Record<string, LanguageEntry>): Record<string, string>;
export function descriptions(data: Record<string, LanguageEntry>): Record<string, string>;
export function aliases(data: Record<string, LanguageEntry[]>): Record<string, string[]>;

export function entity(entity: Entity, options?: SimplifyEntitiesOptions): EntitySimplified;
export function entities(entities: Record<string, Entity>, options?: SimplifyEntitiesOptions): Record<string, EntitySimplified>;
export function sparqlResults(results: SparqlResults, options?: {minimize?: false}): Record<string, SparqlValueType>[];
export function sparqlResults(results: SparqlResults, options: {minimize: true}): SparqlValueRaw[];

export function claims(claims: Record<string, Claim[]>, options?: SimplifyClaimsOptions): Record<string, ClaimSimplified[]>;
export function propertyClaims(propClaims: Claim[], options?: SimplifyClaimsOptions): ClaimSimplified[];
export function claim(claim: Claim, options?: SimplifyClaimsOptions): ClaimSimplified;

export function qualifiers(qualifiers: Record<string, ClaimSnak[]>, options?: SimplifyClaimsOptions): Record<string, ClaimSnakSimplified[]>;
export function propertyQualifiers(propQualifiers: ClaimSnak[], options?: SimplifyClaimsOptions): ClaimSnakSimplified[];
export function qualifier(qualifier: ClaimSnak, options?: SimplifyClaimsOptions): ClaimSnakSimplified;

export function sitelinks(sitelinks: Record<string, Sitelink>, options?: {addUrl?: false} & SimplifySitelinkOptions): Record<string, string>;
export function sitelinks(sitelinks: Record<string, Sitelink>, options?: {addUrl: true} & SimplifySitelinkOptions): Record<string, {title: string, url: string}>;
