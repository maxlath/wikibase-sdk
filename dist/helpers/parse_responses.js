import { simplifyEntities } from './simplify_entity.js';
export const parse = {
    entities: (res) => {
        // Legacy convenience for the time the 'request' lib was all the rage
        // @ts-ignore
        res = res.body || res;
        const { entities } = res;
        return simplifyEntities(entities);
    },
    pagesTitles: (res) => {
        // Same behavior as above
        // @ts-ignore
        res = res.body || res;
        return res.query.search.map(result => result.title);
    },
};
