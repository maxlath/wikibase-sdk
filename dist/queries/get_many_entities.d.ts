import type { GetEntitiesOptions } from './get_entities.js';
import type { EntityId } from '../types/entity.js';
import type { Url } from '../types/options.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
export interface GetManyEntitiesOptions extends GetEntitiesOptions {
    ids: EntityId[];
}
export declare function getManyEntitiesFactory(buildUrl: BuildUrlFunction): ({ ids, languages, props, format, redirects }: GetManyEntitiesOptions) => Url[];
