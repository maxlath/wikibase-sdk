import * as validate from '../helpers/validate.js';
import { rejectObsoleteInterface } from '../utils/utils.js';
export function getEntityRevisionFactory(instance, wgScriptPath) {
    return function getEntityRevision({ id, revision }) {
        rejectObsoleteInterface(arguments);
        validate.entityId(id);
        validate.revisionId(revision);
        return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`;
    };
}
//# sourceMappingURL=get_entity_revision.js.map