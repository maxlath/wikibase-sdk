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
    return `${sparqlEndpoint}?format=${format}&query=${query}`;
}
export function buildQLeverSparqlQueryUrl(sparqlEndpoint, sparql, format = 'json') {
    const { origin, pathname } = new URL(sparqlEndpoint);
    const apiBase = pathname.startsWith('/api') ? sparqlEndpoint : `${origin}/api${pathname}`;
    const action = qleverActionByFormat[format];
    sparql = addWellknownPrefixes(sparql.trim());
    return `${apiBase}?query=${fixedEncodeURIComponent(sparql)}&action=${action}`;
}
const qleverActionByFormat = {
    json: 'json_export',
    csv: 'csv_export',
};
//# sourceMappingURL=sparql_query.js.map