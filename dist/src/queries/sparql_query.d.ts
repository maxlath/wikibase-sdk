import type { Url } from '../utils/build_url.js';
export declare function sparqlQueryFactory(sparqlEndpoint: Url): (sparql: string) => Url;
type SparqlOutputFormat = 'json' | 'csv';
export declare function buildBlazeGraphSparqlQueryUrl(sparqlEndpoint: Url, sparql: string, format?: SparqlOutputFormat): string;
export declare function buildQLeverSparqlQueryUrl(sparqlEndpoint: Url, sparql: string, format?: SparqlOutputFormat): string;
export {};
//# sourceMappingURL=sparql_query.d.ts.map