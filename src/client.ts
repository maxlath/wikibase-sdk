import type { WbGetEntitiesResponse, WbGetManyEntitiesResponse, CirrusSearchPagesResponse, RevisionsResponse } from './helpers/parse_responses.js'
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js'
import type { GetEntitiesOptions } from './queries/get_entities.js'
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js'
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js'
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js'
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js'
import type { GetRevisionsOptions } from './queries/get_revisions.js'
import type { SearchEntitiesOptions } from './queries/search_entities.js'
import type { Entities } from './types/entity.js'
import type { ClientOptions } from './types/options.js'
import type { SearchResponse } from './types/search.js'
import type { SparqlResults } from './types/sparql.js'

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

export async function fetchJson<T> (url: string, clientOptions?: ClientOptions): Promise<T> {
  // Format sdk options to `fetch` RequestInit
  const requestInit: RequestInit = {
    headers: {
      'User-Agent': clientOptions.userAgent || 'wikibase-sdk',
    },
  }
  const res = await fetch(url, requestInit)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`)
  return res.json() as Promise<T>
}

export function buildClient (urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions) {
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

  const fetch = <T>(url: string) => fetchJson<T>(url, clientOptions)

  return {
    searchEntities: (options: SearchEntitiesOptions) => fetch<SearchResponse>(searchEntities(options)),
    cirrusSearchPages: (options: CirrusSearchPagesOptions) => fetch<CirrusSearchPagesResponse>(cirrusSearchPages(options)),
    getEntities: (options: GetEntitiesOptions) => fetch<WbGetEntitiesResponse>(getEntities(options)),
    getManyEntities: async (options: GetManyEntitiesOptions) => {
      const urls = getManyEntities(options)
      const responses = await Promise.all(urls.map(url => fetch<WbGetEntitiesResponse>(url)))
      return responses.reduce<WbGetManyEntitiesResponse>(
        (acc, { entities, error }) => ({
          entities: { ...acc.entities, ...entities },
          errors: error ? [ ...acc.errors, error ] : acc.errors,
        }),
        { entities: {} as Entities, errors: [] }
      )
    },
    getRevisions: (options: GetRevisionsOptions) => fetch<RevisionsResponse>(getRevisions(options)),
    getEntityRevision: (options: GetEntityRevisionOptions) => fetch<WbGetEntitiesResponse>(getEntityRevision(options)),
    getEntitiesFromSitelinks: (options: GetEntitiesFromSitelinksOptions) => fetch<WbGetEntitiesResponse>(getEntitiesFromSitelinks(options)),
    sparqlQuery: (sparql: string) => fetch<SparqlResults>(sparqlQuery(sparql)),
    getReverseClaims: (options: GetReverseClaimsOptions) => fetch<SparqlResults>(getReverseClaims(options)),
  }
}

export type WbkClient = ReturnType<typeof buildClient>
