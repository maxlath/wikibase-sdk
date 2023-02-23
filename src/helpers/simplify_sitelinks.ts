import { typedEntries } from '../utils/utils.js'
import { getSitelinkUrl } from './sitelinks.js'
import type { SimplifySitelinkOptions } from '../types/options.js'
import type { SimplifiedSitelinks, Sitelinks } from '../types/sitelinks.js'

export function simplifySitelinks (sitelinks: Sitelinks, options: SimplifySitelinkOptions = {}): SimplifiedSitelinks {
  let { addUrl, keepBadges, keepAll } = options
  keepBadges = keepBadges || keepAll

  const result: SimplifiedSitelinks = {}

  for (const [ key, value ] of typedEntries(sitelinks)) {
    // Accomodating for wikibase-cli, which might set the sitelink to null
    // to signify that a requested sitelink was not found
    if (value == null) {
      result[key] = null
      continue
    }

    const { title, badges } = value
    if (addUrl || keepBadges) {
      result[key] = { title }
      // @ts-expect-error TypeScript cant assume which of the two types it is
      if (addUrl) result[key].url = getSitelinkUrl({ site: key, title })
      // @ts-expect-error TypeScript cant assume which of the two types it is
      if (keepBadges) result[key].badges = badges
    } else {
      result[key] = title
    }
  }

  return result
}
