import {
	GetEntitiesFromSitelinksOptions,
	GetEntitiesOptions,
	Property,
	UrlResultFormat,
    GetRevisionsOptions,
    SearchEntitiesOptions
} from './options.d'

export function searchEntities(search: string, language?: string, limit?: number, format?: UrlResultFormat, uselang?: string): string;
export function searchEntities(options: SearchEntitiesOptions): string;

export function getEntities(ids: string | string[], languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat): string;
export function getEntities(options: GetEntitiesOptions): string;

export function getManyEntities(ids: string | string[], languages?: string | string[], props?: Property | Property[], format?: UrlResultFormat): string[];
export function getManyEntities(options: GetEntitiesOptions): string[];

export function getRevisions(ids: string | string[], options?: GetRevisionsOptions): string;

// TODO: getEntityRevision

export function getEntitiesFromSitelinks(titles: string | string[], sites: string | string[], languages?: string | string[], props?: string | string[], format?: UrlResultFormat): string;
export function getEntitiesFromSitelinks(options: GetEntitiesFromSitelinksOptions): string;

declare interface WikibaseApiFunctions {
    readonly searchEntities: typeof searchEntities;
    readonly getEntities: typeof getEntities;
    readonly getManyEntities: typeof getManyEntities;
    readonly getRevisions: typeof getRevisions;
    readonly getEntitiesFromSitelinks: typeof getEntitiesFromSitelinks;
}
