import type { SimplifiedSparqlResults, SparqlResults } from '../types/sparql.js';
interface SimplifySparqlResultsOptions {
    minimize?: boolean;
}
export declare function simplifySparqlResults(input: SparqlResults, options?: SimplifySparqlResultsOptions): SimplifiedSparqlResults;
export {};
