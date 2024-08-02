import { typedKeys } from '../utils/utils.js'
import { getSitelinkUrl } from './sitelinks.js'
import type { SimplifySitelinkOptions } from '../types/options.js'
import type { SimplifiedSitelinks, SimplifiedSitelinksWithBadges, SimplifiedSitelinksWithBadgesAndUrls, SimplifiedSitelinksWithUrls, Sitelinks } from '../types/sitelinks.js'

export function simplifySitelinks (sitelinks: Sitelinks, options: SimplifySitelinkOptions = {}) {
  let { addUrl, keepBadges, keepAll } = options
  keepBadges = keepBadges || keepAll
  const simplified = typedKeys(sitelinks).reduce(aggregateValues({
    sitelinks,
    addUrl,
    keepBadges,
  }), {})
  if (keepBadges && addUrl) {
    return simplified as SimplifiedSitelinksWithBadgesAndUrls
  } else if (keepBadges) {
    return simplified as SimplifiedSitelinksWithBadges
  } else if (addUrl) {
    return simplified as SimplifiedSitelinksWithUrls
  } else {
    return simplified as SimplifiedSitelinks
  }
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
