import type { EntityType } from '../types/entity.js';
import type { UrlResultFormat } from '../types/options.js';
import type { BuildUrlFunction, Url } from '../utils/build_url.js';
export interface SearchEntitiesOptions {
    search: string;
    language?: string;
    limit?: string | number;
    continue?: string | number;
    format?: UrlResultFormat;
    uselang?: string;
    type?: EntityType;
}
export declare const searchEntitiesFactory: (buildUrl: BuildUrlFunction) => ({ search, language, uselang, limit, continue: continu, format, type, }: SearchEntitiesOptions) => Url;
//# sourceMappingURL=search_entities.d.ts.map