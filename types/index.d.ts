import {
	InstanceConfig,
	Property,
	UrlResultFormat,
	GetEntitiesFromSitelinksOptions,
	GetEntitiesOptions,
	GetReverseClaimOptions,
	GetRevisionsOptions,
	SearchEntitiesOptions,
	SimplifyClaimsOptions,
	SimplifyEntitiesOptions,
	SimplifySitelinkOptions,
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

import {
	Dictionary
} from './helper'

// The exported object is the WBK function extended with helpers,
// which seems hard to describe as a type declaration
// This weird module interface could be simplified when moving to ES modules
export = WBK;

declare function WBK(config: InstanceConfig): wbk;

interface wbk extends helpers {
	searchEntities: (search: string | SearchEntitiesOptions, language?: string, limit?: number, format?: UrlResultFormat, uselang?: string) => string;

	getEntities: (ids: string | string[] | GetEntitiesOptions, languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat) => string;

	getManyEntities: (ids: string | string[] | GetEntitiesOptions, languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat) => string[];

	sparqlQuery: (query: string) => string;

	getReverseClaims: (property: string | string[], value: string | string[], options?: GetReverseClaimOptions) => string;

	getRevisions: (ids: string | string[], options?: GetRevisionsOptions) => string;

	getEntitiesFromSitelinks: (titles: string | string[] | GetEntitiesFromSitelinksOptions, sites?: string | string[], languages?: string | string[], props?: string | string[], format?: UrlResultFormat) => string;
}

interface helpers {
	isNumericId: (id: string) => boolean;
	isEntityId: (id: string) => boolean;
	isItemId: (id: string) => boolean;
	isPropertyId: (id: string) => boolean;
	isGuid: (guid: string) => boolean;

	getNumericId: (id: string) => number;

	truthyClaims: (claims: Dictionary<Claim[]>) => Dictionary<Claim[]>;
	truthyPropertyClaims: (claims: Claim[]) => Claim[];

	wikidataTimeToDateObject: (wikidataTime: string) => Date;
	wikidataTimeToEpochTime: (wikidataTime: string) => number;
	wikidataTimeToISOString: (wikidataTime: string) => string;
	wikidataTimeToSimpleDay: (wikidataTime: string) => string;

	getImageUrl: (filename: string, width?: number) => string;

	getSitelinkUrl: (site: string, title: string) => string;
	getSitelinkData: (site: string) => {lang: string; project: string};
	isSitelinkKey: (site: string) => boolean;
	simplify: simplify;
}

interface simplify {
	labels: (data: Dictionary<LanguageEntry>) => Dictionary<string>;
	descriptions: (data: Dictionary<LanguageEntry>) => Dictionary<string>;
	aliases: (data: Dictionary<LanguageEntry[]>) => Dictionary<string[]>;

	entity: (entity: Entity, options?: SimplifyEntitiesOptions) => EntitySimplified;
	entities: (entities: Dictionary<Entity>, options?: SimplifyEntitiesOptions) => Dictionary<EntitySimplified>;
	sparqlResults: (results: SparqlResults, options?: {minimize?: false}) => Dictionary<SparqlValueType>[];
	sparqlResults: (results: SparqlResults, options: {minimize: true}) => SparqlValueRaw[];

	claims: (claims: Dictionary<Claim[]>, options?: SimplifyClaimsOptions) => Dictionary<ClaimSimplified[]>;
	propertyClaims: (propClaims: Claim[], options?: SimplifyClaimsOptions) => ClaimSimplified[];
	claim: (claim: Claim, options?: SimplifyClaimsOptions) => ClaimSimplified;

	qualifiers: (qualifiers: Dictionary<ClaimSnak[]>, options?: SimplifyClaimsOptions) => Dictionary<ClaimSnakSimplified[]>;
	propertyQualifiers: (propQualifiers: ClaimSnak[], options?: SimplifyClaimsOptions) => ClaimSnakSimplified[];
	qualifier: (qualifier: ClaimSnak, options?: SimplifyClaimsOptions) => ClaimSnakSimplified;

	sitelinks: (sitelinks: Dictionary<Sitelink>, options?: {addUrl?: false} & SimplifySitelinkOptions) => Dictionary<string>;
	sitelinks: (sitelinks: Dictionary<Sitelink>, options?: {addUrl: true} & SimplifySitelinkOptions) => Dictionary<{title: string, url: string}>;
}
