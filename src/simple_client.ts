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
    async searchEntities (options: SearchEntitiesOptions) {
      const { search } = await client.searchEntities(options)
      return search
    },
    async cirrusSearchPages (options: CirrusSearchPagesOptions) {
      const results = await client.cirrusSearchPages(options)
      return pagesTitles(results)
    },
    async getEntities (options: GetManyEntitiesOptions) {
      const { entities } = await client.getManyEntities(options)
      return simplify(entities)
    },
    async getRevisions (options: GetRevisionsOptions) {
      const results = await client.getRevisions(options)
      return results.query.pages
    },
    async getEntityRevision (options: GetEntityRevisionOptions) {
      const { entities } = await client.getEntityRevision(options)
      return Object.values(simplify(entities))[0]
    },
    async getEntitiesFromSitelinks (options: GetEntitiesFromSitelinksOptions) {
      const { entities } = await client.getEntitiesFromSitelinks(options)
      return simplify(entities)
    },
    async sparqlQuery (sparql: string) {
      const results = await client.sparqlQuery(sparql)
      return simplifySparqlResults(results)
    },
    async getReverseClaims (options: GetReverseClaimsOptions) {
      const results = await client.getReverseClaims(options)
      return simplifySparqlResults(results)
    },
  }
}

export type WbkSimpleClient = ReturnType<typeof buildSimpleClient>
