import type { SimplifiedSparqlResults, SparqlResults } from '../types/sparql.js';
export type SimplifySparqlResultsOptions = {
    readonly minimize?: boolean;
};
export declare function simplifySparqlResults(input: SparqlResults, options?: SimplifySparqlResultsOptions): SimplifiedSparqlResults;
