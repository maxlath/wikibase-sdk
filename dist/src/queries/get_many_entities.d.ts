import type { GetEntitiesOptions } from './get_entities.js';
import type { EntityId } from '../types/entity.js';
import type { BuildUrlFunction, Url } from '../utils/build_url.js';
export interface GetManyEntitiesOptions extends GetEntitiesOptions {
    ids: EntityId[];
}
export declare function getManyEntitiesFactory(buildUrl: BuildUrlFunction): ({ ids, languages, props, format, redirects }: GetManyEntitiesOptions) => Url[];
//# sourceMappingURL=get_many_entities.d.ts.map