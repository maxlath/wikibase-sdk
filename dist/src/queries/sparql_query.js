import { fixedEncodeURIComponent } from '../utils/utils.js';
import { addWellknownPrefixes } from './add_prefixes.js';
export function sparqlQueryFactory(sparqlEndpoint) {
    return function sparqlQuery(sparql) {
        if (sparqlEndpoint.includes('qlever')) {
            return buildQLeverSparqlQueryUrl(sparqlEndpoint, sparql, 'json');
        }
        else {
            return buildBlazeGraphSparqlQueryUrl(sparqlEndpoint, sparql, 'json');
        }
    };
}
export function buildBlazeGraphSparqlQueryUrl(sparqlEndpoint, sparql, format = 'json') {
    const query = fixedEncodeURIComponent(sparql.trim());
    let url = `${sparqlEndpoint}?`;
    // Other formats should be requested by setting the request "accept" header
    // See https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual#Supported_formats
    if (format === 'json')
        url += 'format=json&';
    return url + `query=${query}`;
}
export function buildQLeverSparqlQueryUrl(sparqlEndpoint, sparql, format = 'json') {
    const { origin, pathname } = new URL(sparqlEndpoint);
    const apiBase = pathname.startsWith('/api') ? sparqlEndpoint : `${origin}/api${pathname}`;
    if (!/\w+\/api\/\w+/.test(apiBase)) {
        throw new Error('QLever SPARQL endpoint should be of the form {origin}/api/{index name}. Examples: https://qlever.dev/api/wikidata or https://sparql.dnb.de/api/gnd');
    }
    const action = qleverActionByFormat[format];
    sparql = addWellknownPrefixes(sparql.trim());
    return `${apiBase}?query=${fixedEncodeURIComponent(sparql)}&action=${action}`;
}
const qleverActionByFormat = {
    json: 'json_export',
    csv: 'csv_export',
};
//# sourceMappingURL=sparql_query.js.map