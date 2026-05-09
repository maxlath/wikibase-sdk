import type { ClientUrlBuilders } from './client.js';
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js';
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js';
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js';
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js';
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js';
import type { GetRevisionsOptions } from './queries/get_revisions.js';
import type { SearchEntitiesOptions } from './queries/search_entities.js';
import type { ClientOptions, SimplifyEntityOptions } from './types/options.js';
export declare function buildSimpleClient(urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions, simplifyEntityOptions?: SimplifyEntityOptions): {
    searchEntities(options: SearchEntitiesOptions): Promise<import("./index.js").SearchResult[]>;
    cirrusSearchPages(options: CirrusSearchPagesOptions): Promise<import("./helpers/parse_responses.js").Titles>;
    getEntities(options: GetManyEntitiesOptions): Promise<Record<string, import("./index.js").SimplifiedEntity>>;
    getRevisions(options: GetRevisionsOptions): Promise<Record<string, {
        pageid: number;
        ns: number;
        title: string;
        revisions: {
            revid: number;
            parentid: number;
            minor?: boolean;
            user: string;
            userid: number;
            timestamp: string;
            size: number;
            comment: string;
            parsedcomment: string;
            content?: string;
            tags: string[];
            roles: string[];
        }[];
    }>>;
    getEntityRevision(options: GetEntityRevisionOptions): Promise<import("./index.js").SimplifiedEntity>;
    getEntitiesFromSitelinks(options: GetEntitiesFromSitelinksOptions): Promise<Record<string, import("./index.js").SimplifiedEntity>>;
    sparqlQuery(sparql: string): Promise<(Record<string, import("./index.js").SparqlValueRaw> & Record<string, import("./index.js").SimplifiedSparqlValueGroup>)[]>;
    getReverseClaims(options: GetReverseClaimsOptions): Promise<(Record<string, import("./index.js").SparqlValueRaw> & Record<string, import("./index.js").SimplifiedSparqlValueGroup>)[]>;
};
export type WbkSimpleClient = ReturnType<typeof buildSimpleClient>;
//# sourceMappingURL=simple_client.d.ts.map