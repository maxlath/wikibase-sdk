import type { EntityId } from '../types/entity.js';
import type { Props, UrlResultFormat, LanguageCode } from '../types/options.js';
import type { BuildUrlFunction, Url } from '../utils/build_url.js';
export interface GetEntitiesOptions {
    ids: EntityId | EntityId[];
    languages?: LanguageCode | LanguageCode[];
    props?: Props | Props[];
    format?: UrlResultFormat;
    redirects?: boolean;
}
export declare function getEntitiesFactory(buildUrl: BuildUrlFunction): ({ ids, languages, props, format, redirects, }: GetEntitiesOptions) => Url;
//# sourceMappingURL=get_entities.d.ts.map