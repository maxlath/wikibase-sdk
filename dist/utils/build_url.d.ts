import type { ApiQueryParameters, Url } from '../types/options.js';
export declare function buildUrlFactory(instanceApiEndpoint: Url): (queryObj: ApiQueryParameters) => Url;
export type BuildUrlFunction = (options: ApiQueryParameters) => Url;
