import { simplifyEntities } from './simplify_entity.js'
import type { Entities, SimplifiedEntities } from '../types/entity.js'

export interface WbGetEntitiesResponse {
  entities: Entities;
}

export type Title = string
export type Titles = string[]

export interface CirrusSearchResult {
  title: Title;
}

export interface CirrusSearchPagesResponse {
  query: {
    search: CirrusSearchResult[];
  };
}

export const wb = {
  entities: (res: WbGetEntitiesResponse): SimplifiedEntities => {
    // Legacy convenience for the time the 'request' lib was all the rage
    // @ts-ignore
    res = res.body || res
    const { entities } = res
    return simplifyEntities(entities)
  },

  pagesTitles: (res: CirrusSearchPagesResponse): Titles => {
    // Same behavior as above
    // @ts-ignore
    res = res.body || res
    return res.query.search.map(result => result.title)
  },
}

// Legacy
export const wd = wb
