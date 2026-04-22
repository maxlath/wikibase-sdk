import type { EntityPageTitle } from '../types/entity.js';
import type { UrlResultFormat } from '../types/options.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
export interface GetRevisionsOptions {
    ids: EntityPageTitle | EntityPageTitle[];
    format?: UrlResultFormat;
    limit?: number;
    start?: Date | string | number;
    end?: Date | string | number;
    prop?: string | string[];
    user?: string;
    excludeuser?: string;
    tag?: string;
}
export declare function getRevisionsFactory(buildUrl: BuildUrlFunction): ({ ids, format, limit, start, end, prop, user, excludeuser, tag }: GetRevisionsOptions) => string;
//# sourceMappingURL=get_revisions.d.ts.map