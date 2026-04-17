import { buildClient } from './client.js'
import { pagesTitles } from './helpers/parse_responses.js'
import { simplifyEntities } from './helpers/simplify_entity.js'
import { simplifySparqlResults } from './helpers/simplify_sparql_results.js'
import type { ClientUrlBuilders } from './client.js'
import type { CirrusSearchPagesOptions } from './queries/cirrus_search.js'
import type { GetEntitiesFromSitelinksOptions } from './queries/get_entities_from_sitelinks.js'
import type { GetEntityRevisionOptions } from './queries/get_entity_revision.js'
import type { GetManyEntitiesOptions } from './queries/get_many_entities.js'
import type { GetReverseClaimsOptions } from './queries/get_reverse_claims.js'
import type { GetRevisionsOptions } from './queries/get_revisions.js'
import type { SearchEntitiesOptions } from './queries/search_entities.js'
import type { ClientOptions, SimplifyEntityOptions } from './types/options.js'

export function buildSimpleClient (urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions, simplifyEntityOptions?: SimplifyEntityOptions) {
  const client = buildClient(urlBuilders, clientOptions)
  const simplify = (entities: Parameters<typeof simplifyEntities>[0]) => simplifyEntities(entities, simplifyEntityOptions)

  return {
    searchEntities: async (options: SearchEntitiesOptions) => (await client.searchEntities(options)).search,
    cirrusSearchPages: async (options: CirrusSearchPagesOptions) => pagesTitles(await client.cirrusSearchPages(options)),
    getEntities: async (options: GetManyEntitiesOptions) => simplify((await client.getManyEntities(options)).entities),
    getRevisions: async (options: GetRevisionsOptions) => (await client.getRevisions(options)).query.pages,
    getEntityRevision: async (options: GetEntityRevisionOptions) => Object.values(simplify((await client.getEntityRevision(options)).entities))[0],
    getEntitiesFromSitelinks: async (options: GetEntitiesFromSitelinksOptions) => simplify((await client.getEntitiesFromSitelinks(options)).entities),
    sparqlQuery: async (sparql: string) => simplifySparqlResults(await client.sparqlQuery(sparql)),
    getReverseClaims: async (options: GetReverseClaimsOptions) => simplifySparqlResults(await client.getReverseClaims(options)),
  }
}

export type WbkSimpleClient = ReturnType<typeof buildSimpleClient>
