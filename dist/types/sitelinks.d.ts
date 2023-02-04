import type { ItemId } from './entity.js';
import type { TypedKeyDictionnary } from './helper.js';
import type { Url } from './options.js';
import type { sites } from '../helpers/sitelinks_sites.js';
declare const multilangSitesNames: string[];
export type Site = typeof sites[number] | typeof multilangSitesNames[number];
export interface Sitelink {
    site: Site;
    title: string;
    badges: ItemId[];
    url?: Url;
}
export type Sitelinks = TypedKeyDictionnary<Site, Sitelink>;
export type SimplifiedSitelinks = TypedKeyDictionnary<Site, string>;
export {};
