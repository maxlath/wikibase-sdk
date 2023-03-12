import type { PropertyId } from '../types/entity.js';
import type { Url } from '../types/options.js';
export interface GetReverseClaimsOptions {
    properties: PropertyId | PropertyId[];
    values: string | number | string[] | number[];
    limit?: number;
    caseInsensitive?: boolean;
    keepProperties?: boolean;
}
export declare const getReverseClaimsFactory: (sparqlEndpoint: Url) => (options: GetReverseClaimsOptions) => Url;
