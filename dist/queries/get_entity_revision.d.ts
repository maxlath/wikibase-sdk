import type { EntityId } from '../types/entity.js';
import type { Url } from '../types/options.js';
export interface GetEntityRevisionOptions {
    id: EntityId;
    revision: `${number}`;
}
export declare function getEntityRevisionFactory(instance: any, wgScriptPath: any): ({ id, revision }: GetEntityRevisionOptions) => Url;
