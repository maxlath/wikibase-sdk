import { simplifyEntities } from './simplify_entity.js'
import type { Entities, SimplifiedEntities } from '../types/entity.js'

export interface WbGetEntitiesResponse {
  entities: Entities
  success: number
  error?: {
    code: string
    info: string
    id: string
  }
}

export interface WbGetManyEntitiesResponse {
  entities: Entities
  errors: WbGetEntitiesResponse['error'][]
}

export interface RevisionsResponse {
  query: {
    pages: Record<string, {
      pageid: number
      ns: number
      title: string
      revisions: {
        revid: number
        parentid: number
        minor?: boolean
        user: string
        userid: number
        timestamp: string
        size: number
        comment: string
        parsedcomment: string
        content?: string
        tags: string[]
        roles: string[]
      }[]
    }>
  }
}

export type Title = string
export type Titles = string[]

export interface CirrusSearchResult {
  title: Title
}

export interface CirrusSearchPagesResponse {
  query: {
    search: CirrusSearchResult[]
  }
}

export function entities (res: WbGetEntitiesResponse): SimplifiedEntities {
  // @ts-expect-error Legacy convenience for the time the 'request' lib was all the rage
  res = res.body || res
  const { entities } = res
  return simplifyEntities(entities)
}

export function pagesTitles (res: CirrusSearchPagesResponse): Titles {
  // @ts-expect-error Same behavior as above
  res = res.body || res
  return res.query.search.map(result => result.title)
}
