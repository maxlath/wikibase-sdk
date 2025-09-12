import { type Site } from '../helpers/wikimedia_constants.js';
import type { Props, UrlResultFormat, LanguageCode } from '../types/options.js';
import type { BuildUrlFunction, Url } from '../utils/build_url.js';
export interface GetEntitiesFromSitelinksOptions {
    titles: string | string[];
    sites?: Site | Site[];
    languages?: LanguageCode | LanguageCode[];
    props?: Props | Props[];
    format?: UrlResultFormat;
    redirects?: boolean;
}
export declare function getEntitiesFromSitelinksFactory(buildUrl: BuildUrlFunction): ({ titles, sites, languages, props, format, redirects, }: GetEntitiesFromSitelinksOptions) => Url;
//# sourceMappingURL=get_entities_from_sitelinks.d.ts.map