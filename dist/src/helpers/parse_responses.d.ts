import type { Entities, SimplifiedEntities } from '../types/entity.js';
export interface WbGetEntitiesResponse {
    entities: Entities;
    success: number;
    error?: {
        code: string;
        info: string;
        id: string;
    };
}
export interface WbGetManyEntitiesResponse {
    entities: Entities;
    errors: WbGetEntitiesResponse['error'][];
}
export interface RevisionsResponse {
    query: {
        pages: Record<string, {
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
        }>;
    };
}
export type Title = string;
export type Titles = string[];
export interface CirrusSearchResult {
    title: Title;
}
export interface CirrusSearchPagesResponse {
    query: {
        search: CirrusSearchResult[];
    };
}
export declare function entities(res: WbGetEntitiesResponse): SimplifiedEntities;
export declare function pagesTitles(res: CirrusSearchPagesResponse): Titles;
//# sourceMappingURL=parse_responses.d.ts.map