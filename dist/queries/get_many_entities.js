import { rejectObsoleteInterface } from '../utils/utils.js';
import { getEntitiesFactory } from './get_entities.js';
export function getManyEntitiesFactory(buildUrl) {
    const getEntities = getEntitiesFactory(buildUrl);
    return function getManyEntities({ ids, languages, props, format, redirects }) {
        rejectObsoleteInterface(arguments);
        if (!(ids instanceof Array))
            throw new Error('getManyEntities expects an array of ids');
        return getIdsGroups(ids)
            .map(idsGroup => getEntities({ ids: idsGroup, languages, props, format, redirects }));
    };
}
const getIdsGroups = ids => {
    const groups = [];
    while (ids.length > 0) {
        const group = ids.slice(0, 50);
        ids = ids.slice(50);
        groups.push(group);
    }
    return groups;
};
