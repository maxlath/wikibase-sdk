import type { WbGetEntitiesResponse, WbGetManyEntitiesResponse, CirrusSearchPagesResponse, RevisionsResponse } from './helpers/parse_responses.js';
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js';
import type { GetEntitiesOptions } from './queries/get_entities.js';
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js';
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js';
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js';
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js';
import type { GetRevisionsOptions } from './queries/get_revisions.js';
import type { SearchEntitiesOptions } from './queries/search_entities.js';
import type { ClientOptions } from './types/options.js';
import type { SearchResponse } from './types/search.js';
import type { SparqlResults } from './types/sparql.js';
type GetEntities = (options: GetEntitiesOptions) => string;
type GetManyEntities = (options: GetManyEntitiesOptions) => string[];
type GetRevisions = (options: GetRevisionsOptions) => string;
type GetEntityRevision = (options: GetEntityRevisionOptions) => string;
type GetEntitiesFromSitelinks = (options: GetEntitiesFromSitelinksOptions) => string;
type SearchEntities = (options: SearchEntitiesOptions) => string;
type CirrusSearchPages = (options: CirrusSearchPagesOptions) => string;
type SparqlQuery = (sparql: string) => string;
type GetReverseClaims = (options: GetReverseClaimsOptions) => string;
export interface ClientUrlBuilders {
    searchEntities: SearchEntities;
    cirrusSearchPages: CirrusSearchPages;
    getEntities: GetEntities;
    getManyEntities: GetManyEntities;
    getRevisions: GetRevisions;
    getEntityRevision: GetEntityRevision;
    getEntitiesFromSitelinks: GetEntitiesFromSitelinks;
    sparqlQuery: SparqlQuery;
    getReverseClaims: GetReverseClaims;
}
export declare function buildClient(urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions): {
    searchEntities: (options: SearchEntitiesOptions) => Promise<SearchResponse>;
    cirrusSearchPages: (options: CirrusSearchPagesOptions) => Promise<CirrusSearchPagesResponse>;
    getEntities: (options: GetEntitiesOptions) => Promise<WbGetEntitiesResponse>;
    getManyEntities: (options: GetManyEntitiesOptions) => Promise<WbGetManyEntitiesResponse>;
    getRevisions: (options: GetRevisionsOptions) => Promise<RevisionsResponse>;
    getEntityRevision: (options: GetEntityRevisionOptions) => Promise<WbGetEntitiesResponse>;
    getEntitiesFromSitelinks: (options: GetEntitiesFromSitelinksOptions) => Promise<WbGetEntitiesResponse>;
    sparqlQuery: (sparql: string) => Promise<SparqlResults>;
    getReverseClaims: (options: GetReverseClaimsOptions) => Promise<SparqlResults>;
};
export type WbkClient = ReturnType<typeof buildClient>;
export {};
//# sourceMappingURL=client.d.ts.map