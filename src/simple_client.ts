import { fetchJson } from './client.js'
import { pagesTitles, type CirrusSearchPagesResponse, type RevisionsResponse, type Titles, type WbGetEntitiesResponse } from './helpers/parse_responses.js'
import { simplifyEntities } from './helpers/simplify_entity.js'
import { simplifySparqlResults } from './helpers/simplify_sparql_results.js'
import type { ClientUrlBuilders } from './client.js'
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js'
import type { GetEntitiesOptions } from './queries/get_entities.js'
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js'
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js'
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js'
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js'
import type { GetRevisionsOptions } from './queries/get_revisions.js'
import type { SearchEntitiesOptions } from './queries/search_entities.js'
import type { SimplifiedEntities } from './types/entity.js'
import type { ClientOptions, SimplifyEntityOptions } from './types/options.js'
import type { SearchResponse } from './types/search.js'
import type { SimplifiedSparqlResults, SparqlResults } from './types/sparql.js'

export interface WbkSimpleClient {
  readonly searchEntities: (options: SearchEntitiesOptions) => Promise<SearchResponse>
  readonly cirrusSearchPages: (options: CirrusSearchPagesOptions) => Promise<Titles>
  readonly getEntities: (options: GetEntitiesOptions) => Promise<SimplifiedEntities>
  readonly getManyEntities: (options: GetManyEntitiesOptions) => Promise<{ entities: SimplifiedEntities, errors: WbGetEntitiesResponse['error'][] }>
  readonly getRevisions: (options: GetRevisionsOptions) => Promise<RevisionsResponse>
  readonly getEntityRevision: (options: GetEntityRevisionOptions) => Promise<SimplifiedEntities>
  readonly getEntitiesFromSitelinks: (options: GetEntitiesFromSitelinksOptions) => Promise<SimplifiedEntities>
  readonly sparqlQuery: (sparql: string) => Promise<SimplifiedSparqlResults>
  readonly getReverseClaims: (options: GetReverseClaimsOptions) => Promise<SimplifiedSparqlResults>
}

export function buildSimpleClient (urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions, simplifyEntityOptions?: SimplifyEntityOptions): WbkSimpleClient {
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
  const simplify = (entities: Parameters<typeof simplifyEntities>[0]) => simplifyEntities(entities, simplifyEntityOptions)

  return {
    searchEntities: options => fetch<SearchResponse>(searchEntities(options)),
    cirrusSearchPages: async options => pagesTitles(await fetch<CirrusSearchPagesResponse>(cirrusSearchPages(options))),
    getEntities: async options => simplify((await fetch<WbGetEntitiesResponse>(getEntities(options))).entities),
    getManyEntities: async options => {
      const urls = getManyEntities(options)
      const responses = await Promise.all(urls.map(url => fetch<WbGetEntitiesResponse>(url)))
      return responses.reduce<{ entities: SimplifiedEntities, errors: WbGetEntitiesResponse['error'][] }>(
        (acc, { entities, error }) => ({
          entities: { ...acc.entities, ...simplify(entities) },
          errors: error ? [ ...acc.errors, error ] : acc.errors,
        }),
        { entities: {} as SimplifiedEntities, errors: [] }
      )
    },
    getRevisions: options => fetch<RevisionsResponse>(getRevisions(options)),
    getEntityRevision: async options => simplify((await fetch<WbGetEntitiesResponse>(getEntityRevision(options))).entities),
    getEntitiesFromSitelinks: async options => simplify((await fetch<WbGetEntitiesResponse>(getEntitiesFromSitelinks(options))).entities),
    sparqlQuery: async sparql => simplifySparqlResults(await fetch<SparqlResults>(sparqlQuery(sparql))),
    getReverseClaims: async options => simplifySparqlResults(await fetch<SparqlResults>(getReverseClaims(options))),
  }
}
