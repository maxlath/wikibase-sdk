import type { Entities, SimplifiedEntities } from '../types/entity.js';
export interface WbGetEntitiesResponse {
    entities: Entities;
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
