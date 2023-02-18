import type { ItemId } from './entity.js';
import type { Url } from './options.js';
import type { sites } from '../helpers/sitelinks_sites.js';
declare const multilangSitesNames: ("commons" | "mediawiki" | "meta" | "specieswiki" | "wikidata" | "wikimania")[];
export type Site = typeof sites[number] | typeof multilangSitesNames[number];
export interface Sitelink {
    site: Site;
    title: string;
    badges: ItemId[];
    url?: Url;
}
export type Sitelinks = Partial<Record<Site, Sitelink>>;
export type SimplifiedSitelinks = Partial<Record<Site, string>>;
export {};
