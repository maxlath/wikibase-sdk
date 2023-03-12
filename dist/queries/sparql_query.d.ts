import type { Url } from '../types/options.js';
export declare function sparqlQueryFactory(sparqlEndpoint: Url): (sparql: string) => Url;
