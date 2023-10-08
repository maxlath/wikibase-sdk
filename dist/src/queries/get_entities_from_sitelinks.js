import { sites } from '../helpers/wikimedia_constants.js';
import { forceArray, rejectObsoleteInterface, isOfType } from '../utils/utils.js';
export function getEntitiesFromSitelinksFactory(buildUrl) {
    return function getEntitiesFromSitelinks({ titles, sites, languages, props, format = 'json', redirects, }) {
        rejectObsoleteInterface(arguments);
        // titles cant be let empty
        if (!(titles && titles.length > 0))
            throw new Error('no titles provided');
        // default to the English Wikipedia
        if (!(sites && sites.length > 0))
            sites = ['enwiki'];
        // Properties can be either one property as a string
        // or an array or properties;
        // either case me just want to deal with arrays
        titles = forceArray(titles);
        sites = forceArray(sites).map(parseSite);
        props = forceArray(props);
        const query = {
            action: 'wbgetentities',
            titles: titles.join('|'),
            sites: sites.join('|'),
            format,
        };
        // Normalizing only works if there is only one site and title
        if (sites.length === 1 && titles.length === 1) {
            query.normalize = true;
        }
        if (languages) {
            languages = forceArray(languages);
            query.languages = languages.join('|');
        }
        if (props.length > 0) {
            query.props = props.join('|');
        }
        if (redirects === false)
            query.redirects = 'no';
        return buildUrl(query);
    };
}
/** convert language code to Wikipedia sitelink code */
function parseSite(site) {
    if (isOfType(sites, site)) {
        return site;
    }
    else {
        const wiki = site.replace(/-/g, '_') + 'wiki';
        return wiki;
    }
}
//# sourceMappingURL=get_entities_from_sitelinks.js.map