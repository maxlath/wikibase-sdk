import type { Url, UrlResultFormat } from '../types/options.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
export interface CirrusSearchPagesOptions {
    search?: string;
    haswbstatement?: string | string[];
    limit?: string | number;
    offset?: string | number;
    format?: UrlResultFormat;
    profile?: string;
    sort?: string;
    namespace?: string | string[] | number | number[];
    prop?: string | string[];
}
export declare function cirrusSearchPagesFactory(buildUrl: BuildUrlFunction): (options: CirrusSearchPagesOptions) => Url;
