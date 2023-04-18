import { rejectObsoleteInterface } from '../utils/utils.js';
import { getEntitiesFactory } from './get_entities.js';
export function getManyEntitiesFactory(buildUrl) {
    const getEntities = getEntitiesFactory(buildUrl);
    return function getManyEntities({ ids, languages, props, format, redirects }) {
        rejectObsoleteInterface(arguments);
        if (!(ids instanceof Array))
            throw new Error('getManyEntities expects an array of ids');
        return getChunks(ids)
            .map(idsGroup => getEntities({ ids: idsGroup, languages, props, format, redirects }));
    };
}
function getChunks(ids) {
    const chunks = [];
    while (ids.length > 0) {
        const chunk = ids.slice(0, 50);
        ids = ids.slice(50);
        chunks.push(chunk);
    }
    return chunks;
}
//# sourceMappingURL=get_many_entities.js.map