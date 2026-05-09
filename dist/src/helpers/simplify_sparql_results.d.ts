import type { SimplifiedSparqlResults, SparqlResults, SimplifiedSparqlValueGroup, SparqlValueRaw } from '../types/sparql.js';
export declare function simplifySparqlResults(input: SparqlResults | string): (Record<string, SparqlValueRaw> & Record<string, SimplifiedSparqlValueGroup>)[];
export declare function minimizeSimplifiedSparqlResults(simplifySparqlResults: SimplifiedSparqlResults): SimplifiedSparqlResults | SparqlValueRaw[];
//# sourceMappingURL=simplify_sparql_results.d.ts.map