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
export declare const specialSites: {
    commonswiki: string;
    mediawikiwiki: string;
    metawiki: string;
    specieswiki: string;
    wikidatawiki: string;
    wikimaniawiki: string;
};
export declare const isSitelinkKey: (site: string) => boolean;
declare const projectsNames: string[];
type Project = typeof projectsNames[number];
export {};
