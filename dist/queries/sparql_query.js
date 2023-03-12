import { fixedEncodeURIComponent } from '../utils/utils.js';
export function sparqlQueryFactory(sparqlEndpoint) {
    return function sparqlQuery(sparql) {
        const query = fixedEncodeURIComponent(sparql);
        return `${sparqlEndpoint}?format=json&query=${query}`;
    };
}
//# sourceMappingURL=sparql_query.js.map