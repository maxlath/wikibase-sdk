import type { Url, WmLanguageCode } from '../types/options.js';
import type { Site } from '../types/sitelinks.js';
export interface GetSitelinkUrlOptions {
    site: Site;
    title: string;
}
export declare function getSitelinkUrl({ site, title }: GetSitelinkUrlOptions): Url;
export interface SitelinkData {
    lang: WmLanguageCode;
    project: Project;
    key: string;
    title?: string;
    url?: Url;
}
export declare function getSitelinkData(site: Site | Url): SitelinkData;
export declare const isSitelinkKey: (site: string) => boolean;
declare const projectNames: readonly ("specieswiki" | "commons" | "mediawiki" | "meta" | "wikidata" | "wikimania" | "wikipedia" | "wikisource" | "wikiquote" | "wiktionary" | "wikibooks" | "wikiversity" | "wikivoyage" | "wikinews")[];
export type Project = typeof projectNames[number];
export {};
