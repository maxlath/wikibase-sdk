import type { SimplifiedSitelinks, SimplifiedSitelinksWithBadges, SimplifiedSitelinksWithBadgesAndUrls, SimplifiedSitelinksWithUrls, Sitelinks } from '../types/sitelinks.js';
type SimplifySitelinksOptionsOn = {
    addUrl: true;
} & ({
    keepBadges: true;
} | {
    keepAll: true;
});
type SimplifySitelinksOptionsOff = undefined | {
    addUrl: false | undefined;
} & ({
    keepBadges: false | undefined;
} | {
    keepAll: false | undefined;
});
export declare function simplifySitelinks(sitelinks: Sitelinks, options: {
    addUrl: true;
}): SimplifiedSitelinksWithUrls;
export declare function simplifySitelinks(sitelinks: Sitelinks, options: {
    keepBadges: true;
} | {
    keepAll: true;
}): SimplifiedSitelinksWithBadges;
export declare function simplifySitelinks(sitelinks: Sitelinks, options: SimplifySitelinksOptionsOn): SimplifiedSitelinksWithBadgesAndUrls;
export declare function simplifySitelinks(sitelinks: Sitelinks, options?: SimplifySitelinksOptionsOff): SimplifiedSitelinks;
export {};
//# sourceMappingURL=simplify_sitelinks.d.ts.map