import type { ItemId } from './entity.js';
import type { Site } from '../helpers/wikimedia_constants.js';
import type { Url } from '../utils/build_url.js';
export type SitelinkBadges = ItemId[];
export type SitelinkTitle = string;
export interface Sitelink {
    site: Site;
    title: SitelinkTitle;
    badges: SitelinkBadges;
    url?: Url;
}
export type Sitelinks = Partial<Record<Site, Sitelink>>;
export type SimplifiedSitelinkWithBadges = {
    title: SitelinkTitle;
    badges: SitelinkBadges;
};
export type SimplifiedSitelinkWithUrl = {
    title: SitelinkTitle;
    url: Url;
};
export type SimplifiedSitelinkWithBadgesAndUrl = {
    title: SitelinkTitle;
    url: Url;
    badges: SitelinkBadges;
};
export type SimplifiedSitelinks = Partial<Record<Site, SitelinkTitle>>;
export type SimplifiedSitelinksWithBadges = Partial<Record<Site, SimplifiedSitelinkWithBadges>>;
export type SimplifiedSitelinksWithUrls = Partial<Record<Site, SimplifiedSitelinkWithUrl>>;
export type SimplifiedSitelinksWithBadgesAndUrls = Partial<Record<Site, SimplifiedSitelinkWithBadgesAndUrl>>;
//# sourceMappingURL=sitelinks.d.ts.map