import { buildClient } from './client.js';
import { pagesTitles } from './helpers/parse_responses.js';
import { simplifyEntities } from './helpers/simplify_entity.js';
import { simplifySparqlResults } from './helpers/simplify_sparql_results.js';
export function buildSimpleClient(urlBuilders, clientOptions, simplifyEntityOptions) {
    const client = buildClient(urlBuilders, clientOptions);
    const simplify = (entities) => simplifyEntities(entities, simplifyEntityOptions);
    return {
        async searchEntities(options) {
            const { search } = await client.searchEntities(options);
            return search;
        },
        async cirrusSearchPages(options) {
            const results = await client.cirrusSearchPages(options);
            return pagesTitles(results);
        },
        async getEntities(options) {
            const { entities } = await client.getManyEntities(options);
            return simplify(entities);
        },
        async getRevisions(options) {
            const results = await client.getRevisions(options);
            return results.query.pages;
        },
        async getEntityRevision(options) {
            const { entities } = await client.getEntityRevision(options);
            return Object.values(simplify(entities))[0];
        },
        async getEntitiesFromSitelinks(options) {
            const { entities } = await client.getEntitiesFromSitelinks(options);
            return simplify(entities);
        },
        async sparqlQuery(sparql) {
            const results = await client.sparqlQuery(sparql);
            return simplifySparqlResults(results);
        },
        async getReverseClaims(options) {
            const results = await client.getReverseClaims(options);
            return simplifySparqlResults(results);
        },
    };
}
//# sourceMappingURL=simple_client.js.map