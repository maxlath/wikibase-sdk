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
export declare const parse: {
    entities: (res: WbGetEntitiesResponse) => SimplifiedEntities;
    pagesTitles: (res: CirrusSearchPagesResponse) => Titles;
};
