import {
	Property,
	SearchType,
	UrlResultFormat,
	GetEntitiesFromSitelinksOptions,
	GetEntitiesOptions,
	GetReverseClaimOptions,
	GetRevisionsOptions,
	SearchEntitiesOptions,
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

import {Dictionary} from './helper'

export as namespace wdk

export * from './claim.d'
export * from './entity.d'
export * from './options.d'
export * from './search.d'
export * from './sparql.d'

export function searchEntities(search: string, language?: string, limit?: number, format?: UrlResultFormat, uselang?: string): string;
export function searchEntities(options: SearchEntitiesOptions): string;

export function getEntities(ids: string | string[], languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat): string;
export function getEntities(options: GetEntitiesOptions): string;

export function getManyEntities(ids: string | string[], languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat): string[];
export function getManyEntities(options: GetEntitiesOptions): string[];

export function sparqlQuery(query: string): string;

export function getReverseClaims(property: string | string[], value: string | string[], options?: GetReverseClaimOptions): string;

export function getRevisions(ids: string | string[], options?: GetRevisionsOptions): string;

export function getEntitiesFromSitelinks(titles: string | string[], sites: string | string[], languages?: string | string[], props?: string | string[], format?: UrlResultFormat): string;
export function getEntitiesFromSitelinks(options: GetEntitiesFromSitelinksOptions): string;

// Helpers
export function isNumericId(id: string): boolean;
export function isEntityId(id: string): boolean;
export function isItemId(id: string): boolean;
export function isPropertyId(id: string): boolean;
export function isGuid(guid: string): boolean;

export function getNumericId(id: string): number;

export function truthyClaims(claims: Dictionary<Claim[]>): Dictionary<Claim[]>;
export function truthyPropertyClaims(claims: Claim[]): Claim[];

export function wikidataTimeToDateObject(wikidataTime: string): Date;
export function wikidataTimeToEpochTime(wikidataTime: string): number;
export function wikidataTimeToISOString(wikidataTime: string): string;
export function wikidataTimeToSimpleDay(wikidataTime: string): string;

export function getImageUrl(filename: string, width?: number): string;

// Sitelink helpers
export function getSitelinkUrl(site: string, title: string): string;
export function getSitelinkData(site: string): {lang: string; project: string};
export function isSitelinkKey(site: string): boolean;

export namespace simplify {
	export function labels(data: Dictionary<LanguageEntry>): Dictionary<string>;
	export function descriptions(data: Dictionary<LanguageEntry>): Dictionary<string>;
	export function aliases(data: Dictionary<LanguageEntry[]>): Dictionary<string[]>;

	export function entity(entity: Entity, options?: SimplifyEntitiesOptions): EntitySimplified;
	export function entities(entities: Dictionary<Entity>, options?: SimplifyEntitiesOptions): Dictionary<EntitySimplified>;
	export function sparqlResults(results: SparqlResults, options?: {minimize?: false}): Dictionary<SparqlValueType>[];
	export function sparqlResults(results: SparqlResults, options: {minimize: true}): SparqlValueRaw[];

	export function claims(claims: Dictionary<Claim[]>, options?: SimplifyClaimsOptions): Dictionary<ClaimSimplified[]>;
	export function propertyClaims(propClaims: Claim[], options?: SimplifyClaimsOptions): ClaimSimplified[];
	export function claim(claim: Claim, options?: SimplifyClaimsOptions): ClaimSimplified;

	export function qualifiers(qualifiers: Dictionary<ClaimSnak[]>, options?: SimplifyClaimsOptions): Dictionary<ClaimSnakSimplified[]>;
	export function propertyQualifiers(propQualifiers: ClaimSnak[], options?: SimplifyClaimsOptions): ClaimSnakSimplified[];
	export function qualifier(qualifier: ClaimSnak, options?: SimplifyClaimsOptions): ClaimSnakSimplified;

	export function sitelinks(sitelinks: Dictionary<Sitelink>, options?: {addUrl?: false} & SimplifySitelinkOptions): Dictionary<string>;
	export function sitelinks(sitelinks: Dictionary<Sitelink>, options?: {addUrl: true} & SimplifySitelinkOptions): Dictionary<{title: string, url: string}>;
}
