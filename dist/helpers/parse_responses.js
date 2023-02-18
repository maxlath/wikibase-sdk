import { simplifyEntities } from './simplify_entity.js';
function entities(res) {
    // @ts-expect-error Legacy convenience for the time the 'request' lib was all the rage
    res = res.body || res;
    const { entities } = res;
    return simplifyEntities(entities);
}
function pagesTitles(res) {
    // @ts-expect-error Same behavior as above
    res = res.body || res;
    return res.query.search.map(result => result.title);
}
export const parse = { entities, pagesTitles };
//# sourceMappingURL=parse_responses.js.map