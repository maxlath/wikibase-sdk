import { languages } from '../helpers/sitelinks_languages.js';
import { forceArray, shortLang, rejectObsoleteInterface, isOfType } from '../utils/utils.js';
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
            languages = forceArray(languages).map(shortLang);
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
    if (isOfType(languages, site)) {
        // The `as Site` conversion shouldnt be needed but WmLanguageCode and Site do not seem to be perfectly in sync?
        // Both are created by scripts so this is also out of sync on the Wikimedia projects?
        return `${site}wiki`;
    }
    else {
        return site;
    }
}
//# sourceMappingURL=get_entities_from_sitelinks.js.map