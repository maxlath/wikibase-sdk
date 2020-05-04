import {GetReverseClaimOptions} from './options'

export function sparqlQuery(query: string): string;

export function getReverseClaims(property: string | string[], value: string | string[], options?: GetReverseClaimOptions): string;

declare interface WikibaseQueryServiceFunctions {
    readonly sparqlQuery: typeof sparqlQuery;
    readonly getReverseClaims: typeof getReverseClaims;
}
