import type { Entities, SimplifiedEntities } from '../types/entity.js';
export interface WbGetEntitiesResponse {
    entities: Entities;
    success: number;
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