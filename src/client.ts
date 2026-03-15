import type { WbGetEntitiesResponse, CirrusSearchPagesResponse } from './helpers/parse_responses.js'
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js'
import type { GetEntitiesOptions } from './queries/get_entities.js'
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js'
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js'
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js'
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js'
import type { GetRevisionsOptions } from './queries/get_revisions.js'
import type { SearchEntitiesOptions } from './queries/search_entities.js'
import type { SearchResponse } from './types/search.js'
import type { SparqlResults } from './types/sparql.js'

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

export interface WbkClient {
  readonly searchEntities: (options: SearchEntitiesOptions) => Promise<SearchResponse>
  readonly cirrusSearchPages: (options: CirrusSearchPagesOptions) => Promise<CirrusSearchPagesResponse>
  readonly getEntities: (options: GetEntitiesOptions) => Promise<WbGetEntitiesResponse>
  readonly getManyEntities: (options: GetManyEntitiesOptions) => Promise<WbGetEntitiesResponse[]>
  readonly getRevisions: (options: GetRevisionsOptions) => Promise<RevisionsResponse>
  readonly getEntityRevision: (options: GetEntityRevisionOptions) => Promise<WbGetEntitiesResponse>
  readonly getEntitiesFromSitelinks: (options: GetEntitiesFromSitelinksOptions) => Promise<WbGetEntitiesResponse>
  readonly sparqlQuery: (sparql: string) => Promise<SparqlResults>
  readonly getReverseClaims: (options: GetReverseClaimsOptions) => Promise<SparqlResults>
}

type GetEntities = (options: GetEntitiesOptions) => string
type GetManyEntities = (options: GetManyEntitiesOptions) => string[]
type GetRevisions = (options: GetRevisionsOptions) => string
type GetEntityRevision = (options: GetEntityRevisionOptions) => string
type GetEntitiesFromSitelinks = (options: GetEntitiesFromSitelinksOptions) => string
type SearchEntities = (options: SearchEntitiesOptions) => string
type CirrusSearchPages = (options: CirrusSearchPagesOptions) => string
type SparqlQuery = (sparql: string) => string
type GetReverseClaims = (options: GetReverseClaimsOptions) => string

export interface ClientUrlBuilders {
  searchEntities: SearchEntities
  cirrusSearchPages: CirrusSearchPages
  getEntities: GetEntities
  getManyEntities: GetManyEntities
  getRevisions: GetRevisions
  getEntityRevision: GetEntityRevision
  getEntitiesFromSitelinks: GetEntitiesFromSitelinks
  sparqlQuery: SparqlQuery
  getReverseClaims: GetReverseClaims
}

async function fetchJson<T> (url: string, fetchOptions?: RequestInit): Promise<T> {
  const res = await fetch(url, fetchOptions)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`)
  return res.json() as Promise<T>
}

export function buildClient (urlBuilders: ClientUrlBuilders, fetchOptions?: RequestInit): WbkClient {
  const {
    searchEntities,
    cirrusSearchPages,
    getEntities,
    getManyEntities,
    getRevisions,
    getEntityRevision,
    getEntitiesFromSitelinks,
    sparqlQuery,
    getReverseClaims,
  } = urlBuilders

  const fetch = <T>(url: string) => fetchJson<T>(url, fetchOptions)

  return {
    searchEntities: options => fetch<SearchResponse>(searchEntities(options)),
    cirrusSearchPages: options => fetch<CirrusSearchPagesResponse>(cirrusSearchPages(options)),
    getEntities: options => fetch<WbGetEntitiesResponse>(getEntities(options)),
    getManyEntities: async options => {
      const urls = getManyEntities(options)
      return Promise.all(urls.map(url => fetch<WbGetEntitiesResponse>(url)))
    },
    getRevisions: options => fetch<RevisionsResponse>(getRevisions(options)),
    getEntityRevision: options => fetch<WbGetEntitiesResponse>(getEntityRevision(options)),
    getEntitiesFromSitelinks: options => fetch<WbGetEntitiesResponse>(getEntitiesFromSitelinks(options)),
    sparqlQuery: sparql => fetch<SparqlResults>(sparqlQuery(sparql)),
    getReverseClaims: options => fetch<SparqlResults>(getReverseClaims(options)),
  }
}
