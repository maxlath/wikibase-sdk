import type { EntityId, RevisionId } from '../types/entity.js';
import type { Url } from '../types/options.js';
export interface GetEntityRevisionOptions {
    id: EntityId;
    revision: RevisionId;
}
export declare function getEntityRevisionFactory(instance: Url, wgScriptPath: string): ({ id, revision }: GetEntityRevisionOptions) => Url;
