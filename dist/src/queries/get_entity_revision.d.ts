import type { EntityId, RevisionId } from '../types/entity.js';
import type { Url } from '../utils/build_url.js';
export interface GetEntityRevisionOptions {
    id: EntityId;
    revision: RevisionId;
}
export declare function getEntityRevisionFactory(instance: Url, wgScriptPath: string): ({ id, revision }: GetEntityRevisionOptions) => Url;
//# sourceMappingURL=get_entity_revision.d.ts.map