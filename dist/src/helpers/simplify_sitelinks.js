import { typedKeys } from '../utils/utils.js';
import { getSitelinkUrl } from './sitelinks.js';
export function simplifySitelinks(sitelinks, options = {}) {
    let { addUrl, keepBadges, keepAll } = options;
    keepBadges = keepBadges || keepAll;
    return typedKeys(sitelinks).reduce(aggregateValues({
        sitelinks,
        addUrl,
        keepBadges,
    }), {});
}
const aggregateValues = ({ sitelinks, addUrl, keepBadges }) => (index, key) => {
    // Accomodating for wikibase-cli, which might set the sitelink to null
    // to signify that a requested sitelink was not found
    if (sitelinks[key] == null) {
        index[key] = sitelinks[key];
        return index;
    }
    const { title, badges } = sitelinks[key];
    if (addUrl || keepBadges) {
        index[key] = { title };
        if (addUrl)
            index[key].url = getSitelinkUrl({ site: key, title });
        if (keepBadges)
            index[key].badges = badges;
    }
    else {
        index[key] = title;
    }
    return index;
};
//# sourceMappingURL=simplify_sitelinks.js.map