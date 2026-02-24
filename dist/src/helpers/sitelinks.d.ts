import { specialSites, type Site } from './wikimedia_constants.js';
import type { LanguageCode } from '../types/options.js';
import type { Url } from '../utils/build_url.js';
type ValueOf<T> = T[keyof T];
type SpecialSiteProjectName = ValueOf<typeof specialSites>;
export interface GetSitelinkUrlOptions {
    site: Site | SpecialSiteProjectName;
    title: string;
}
export declare function getSitelinkUrl({ site, title }: GetSitelinkUrlOptions): Url;
export interface SitelinkData {
    lang: LanguageCode;
    project: Project;
    key: string;
    title?: string;
    url?: Url;
}
export declare function getSitelinkData(site: Site | Url): SitelinkData;
export declare const isSite: (site: string) => site is Site;
/** @deprecated use isSite */
export declare const isSitelinkKey: (site: string) => site is Site;
declare const projectNames: readonly ("commons" | "foundation" | "mediawiki" | "meta" | "outreach" | "sources" | "species" | "wikidata" | "wikifunctions" | "wikimania" | "wikipedia" | "wikisource" | "wikiquote" | "wiktionary" | "wikibooks" | "wikiversity" | "wikivoyage" | "wikinews")[];
export type Project = typeof projectNames[number];
export {};
//# sourceMappingURL=sitelinks.d.ts.map