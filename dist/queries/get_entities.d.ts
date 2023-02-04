import type { Props, Url, UrlResultFormat, WmLanguageCode } from '../types/options.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
export interface GetEntitiesOptions {
    ids: string | string[];
    languages?: WmLanguageCode | WmLanguageCode[];
    props?: Props | Props[];
    format?: UrlResultFormat;
    redirects?: boolean;
}
export declare function getEntitiesFactory(buildUrl: BuildUrlFunction): ({ ids, languages, props, format, redirects, }: GetEntitiesOptions) => Url;
