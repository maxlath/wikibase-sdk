import type { ApiQueryParameters, Url } from '../types/options.js';
export declare function buildUrlFactory(instanceApiEndpoint: Url): BuildUrlFunction;
export type BuildUrlFunction = (options: ApiQueryParameters) => Url;
