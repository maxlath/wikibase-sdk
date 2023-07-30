import { fixedEncodeURIComponent, isAKey, isOfType, rejectObsoleteInterface, replaceSpaceByUnderscores } from '../utils/utils.js';
import { languages } from './sitelinks_languages.js';
import { specialSites } from './special_sites.js';
const wikidataBase = 'https://www.wikidata.org/wiki/';
export function getSitelinkUrl({ site, title }) {
    rejectObsoleteInterface(arguments);
    if (!site)
        throw new Error('missing a site');
    if (!title)
        throw new Error('missing a title');
    if (isAKey(siteUrlBuilders, site)) {
        return siteUrlBuilders[site](title);
    }
    const shortSiteKey = site.replace(/wiki$/, '');
    if (isAKey(siteUrlBuilders, shortSiteKey)) {
        return siteUrlBuilders[shortSiteKey](title);
    }
    const { lang, project } = getSitelinkData(site);
    title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title));
    return `https://${lang}.${project}.org/wiki/${title}`;
}
const wikimediaSite = (subdomain) => (title) => `https://${subdomain}.wikimedia.org/wiki/${title}`;
const siteUrlBuilders = {
    commons: wikimediaSite('commons'),
    mediawiki: (title) => `https://www.mediawiki.org/wiki/${title}`,
    meta: wikimediaSite('meta'),
    species: wikimediaSite('species'),
    wikidata: (entityId) => {
        const prefix = prefixByEntityLetter[entityId[0]];
        let title = prefix ? `${prefix}:${entityId}` : entityId;
        // Required for forms and senses
        title = title.replace('-', '#');
        return `${wikidataBase}${title}`;
    },
    wikimania: wikimediaSite('wikimania'),
};
const prefixByEntityLetter = {
    E: 'EntitySchema',
    L: 'Lexeme',
    P: 'Property',
};
const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/;
export function getSitelinkData(site) {
    if (site.startsWith('http')) {
        const url = site;
        const matchData = url.match(sitelinkUrlPattern);
        if (!matchData)
            throw new Error(`invalid sitelink url: ${url}`);
        let [lang, project, title] = matchData.slice(1);
        title = decodeURIComponent(title);
        let key;
        // Known case: wikidata, mediawiki
        if (lang === 'www') {
            lang = 'en';
            key = project;
        }
        else if (lang === 'commons') {
            lang = 'en';
            project = key = 'commons';
        }
        else {
            // Support multi-parts language codes, such as be_x_old
            lang = lang.replace(/-/g, '_');
            key = `${lang}${project}`.replace('wikipedia', 'wiki');
        }
        // @ts-expect-error
        return { lang, project, key, title, url };
    }
    else {
        const key = site;
        if (isAKey(specialSites, site)) {
            const project = specialSites[site];
            return { lang: 'en', project, key };
        }
        let [lang, projectSuffix, rest] = key.split('wik');
        // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
        if (rest != null)
            throw new Error(`invalid sitelink key: ${key}`);
        if (!isOfType(languages, lang)) {
            throw new Error(`sitelink lang not found: ${lang}. Updating wikibase-sdk to a more recent version might fix the issue.`);
        }
        // Support keys such as be_x_oldwiki, which refers to be-x-old.wikipedia.org
        lang = lang.replace(/_/g, '-');
        const project = projectsBySuffix[projectSuffix];
        if (!project)
            throw new Error(`sitelink project not found: ${project}`);
        // @ts-expect-error
        return { lang, project, key };
    }
}
export const isSitelinkKey = (site) => {
    try {
        // relies on getSitelinkData validation
        getSitelinkData(site);
        return true;
    }
    catch (err) {
        return false;
    }
};
export const wikimediaLanguageCodes = languages;
const projectsBySuffix = {
    i: 'wikipedia',
    isource: 'wikisource',
    iquote: 'wikiquote',
    tionary: 'wiktionary',
    ibooks: 'wikibooks',
    iversity: 'wikiversity',
    ivoyage: 'wikivoyage',
    inews: 'wikinews',
};
const projectNames = [
    ...Object.values(projectsBySuffix),
    ...Object.values(specialSites),
];
//# sourceMappingURL=sitelinks.js.map