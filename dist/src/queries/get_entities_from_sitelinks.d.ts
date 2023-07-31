import type { Props, UrlResultFormat, WmLanguageCode } from '../types/options.js';
import type { Site } from '../types/sitelinks.js';
import type { BuildUrlFunction, Url } from '../utils/build_url.js';
export interface GetEntitiesFromSitelinksOptions {
    titles: string | string[];
    sites?: Site | Site[];
    languages?: WmLanguageCode | WmLanguageCode[];
    props?: Props | Props[];
    format?: UrlResultFormat;
    redirects?: boolean;
}
export declare function getEntitiesFromSitelinksFactory(buildUrl: BuildUrlFunction): ({ titles, sites, languages, props, format, redirects, }: GetEntitiesFromSitelinksOptions) => Url;
//# sourceMappingURL=get_entities_from_sitelinks.d.ts.map