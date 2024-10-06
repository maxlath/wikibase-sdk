import * as validate from '../helpers/validate.js';
import { forceArray, rejectObsoleteInterface } from '../utils/utils.js';
export function getRevisionsFactory(buildUrl) {
    return function getRevisions({ ids, format, limit, start, end, prop, user, excludeuser, tag }) {
        rejectObsoleteInterface(arguments);
        ids = forceArray(ids);
        ids.forEach(o => validate.entityPageTitle(o));
        const uniqueId = ids.length === 1;
        const query = {
            action: 'query',
            prop: 'revisions',
        };
        query.titles = ids.join('|');
        query.format = format || 'json';
        if (uniqueId)
            query.rvlimit = limit || 'max';
        if (uniqueId && start)
            query.rvstart = getEpochSeconds(start);
        if (uniqueId && end)
            query.rvend = getEpochSeconds(end);
        if (prop) {
            query.rvprop = forceArray(prop).join('|');
        }
        else {
            query.rvprop = 'ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores';
        }
        query.rvslots = '*';
        if (user)
            query.rvuser = user;
        if (excludeuser)
            query.rvexcludeuser = excludeuser;
        if (tag)
            query.rvtag = tag;
        return buildUrl(query);
    };
}
const getEpochSeconds = (date) => {
    // Return already formatted epoch seconds:
    // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
    // already seconds actually
    if (typeof date === 'number' && date < earliestPointInMs)
        return date;
    return Math.trunc(new Date(date).getTime() / 1000);
};
const earliestPointInMs = new Date('2000-01-01').getTime();
//# sourceMappingURL=get_revisions.js.map