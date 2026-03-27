import { buildClient } from './client.js'
import { pagesTitles } from './helpers/parse_responses.js'
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
import type { ClientOptions, SimplifyEntityOptions } from './types/options.js'

export function buildSimpleClient (urlBuilders: ClientUrlBuilders, clientOptions?: ClientOptions, simplifyEntityOptions?: SimplifyEntityOptions) {
  const client = buildClient(urlBuilders, clientOptions)
  const simplify = (entities: Parameters<typeof simplifyEntities>[0]) => simplifyEntities(entities, simplifyEntityOptions)

  return {
    searchEntities: (options: SearchEntitiesOptions) => client.searchEntities(options),
    cirrusSearchPages: async (options: CirrusSearchPagesOptions) => pagesTitles(await client.cirrusSearchPages(options)),
    getEntities: async (options: GetEntitiesOptions) => simplify((await client.getEntities(options)).entities),
    getManyEntities: async (options: GetManyEntitiesOptions) => {
      const { entities, errors } = await client.getManyEntities(options)
      return { entities: simplify(entities), errors }
    },
    getRevisions: (options: GetRevisionsOptions) => client.getRevisions(options),
    getEntityRevision: async (options: GetEntityRevisionOptions) => simplify((await client.getEntityRevision(options)).entities),
    getEntitiesFromSitelinks: async (options: GetEntitiesFromSitelinksOptions) => simplify((await client.getEntitiesFromSitelinks(options)).entities),
    sparqlQuery: async (sparql: string) => simplifySparqlResults(await client.sparqlQuery(sparql)),
    getReverseClaims: async (options: GetReverseClaimsOptions) => simplifySparqlResults(await client.getReverseClaims(options)),
  }
}

export type WbkSimpleClient = ReturnType<typeof buildSimpleClient>
