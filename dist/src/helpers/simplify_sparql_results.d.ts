import type { SparqlResults, SparqlValueRaw, SparqlValueType } from '../types/sparql.js';
export type SimplifySparqlResultsOptions = {
    readonly minimize?: boolean;
};
export declare function simplifySparqlResults(input: SparqlResults, options?: SimplifySparqlResultsOptions): Array<Record<string, SparqlValueType>> | SparqlValueRaw[];
//# sourceMappingURL=simplify_sparql_results.d.ts.map