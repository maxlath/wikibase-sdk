import type { GetEntitiesOptions } from './get_entities.js';
import type { Url } from '../types/options.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
export interface GetManyEntitiesOptions extends GetEntitiesOptions {
    ids: string[];
}
export declare function getManyEntitiesFactory(buildUrl: BuildUrlFunction): ({ ids, languages, props, format, redirects }: GetManyEntitiesOptions) => Url[];
