import { typedKeys } from '../utils/utils.js'
import { getSitelinkUrl } from './sitelinks.js'
import type { SimplifySitelinkOptions } from '../types/options.js'
import type { SimplifiedSitelinks, SimplifiedSitelinksWithBadges, SimplifiedSitelinksWithBadgesAndUrls, SimplifiedSitelinksWithUrls, Sitelinks } from '../types/sitelinks.js'

type SimplifySitelinksOptionsOn = { addUrl: true } & ({ keepBadges: true } | { keepAll: true })
type SimplifySitelinksOptionsOff = undefined | { addUrl: false | undefined } & ({ keepBadges: false | undefined } | { keepAll: false | undefined })

export function simplifySitelinks (sitelinks: Sitelinks, options: { addUrl: true }): SimplifiedSitelinksWithUrls
export function simplifySitelinks (sitelinks: Sitelinks, options: { keepBadges: true } | { keepAll: true }): SimplifiedSitelinksWithBadges
export function simplifySitelinks (sitelinks: Sitelinks, options: SimplifySitelinksOptionsOn): SimplifiedSitelinksWithBadgesAndUrls
export function simplifySitelinks (sitelinks: Sitelinks, options?: SimplifySitelinksOptionsOff): SimplifiedSitelinks
export function simplifySitelinks (sitelinks: Sitelinks, options: SimplifySitelinkOptions = {}): SimplifiedSitelinksWithBadgesAndUrls | SimplifiedSitelinksWithBadges | SimplifiedSitelinksWithUrls | SimplifiedSitelinks {
  let { addUrl, keepBadges, keepAll } = options
  keepBadges = keepBadges || keepAll
  return typedKeys(sitelinks).reduce(aggregateValues({
    sitelinks,
    addUrl,
    keepBadges,
  }), {})
}

const aggregateValues = ({ sitelinks, addUrl, keepBadges }) => (index, key) => {
  // Accomodating for wikibase-cli, which might set the sitelink to null
  // to signify that a requested sitelink was not found
  if (sitelinks[key] == null) {
    index[key] = sitelinks[key]
    return index
  }

  const { title, badges } = sitelinks[key]
  if (addUrl || keepBadges) {
    index[key] = { title }
    if (addUrl) index[key].url = getSitelinkUrl({ site: key, title })
    if (keepBadges) index[key].badges = badges
  } else {
    index[key] = title
  }
  return index
}
