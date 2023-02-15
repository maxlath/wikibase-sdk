import * as validate from '../helpers/validate.js'
import { forceArray, rejectObsoleteInterface } from '../utils/utils.js'
import type { EntityPageTitle } from '../types/entity.js'
import type { ApiQueryParameters, UrlResultFormat } from '../types/options.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

// See https://www.wikidata.org/w/api.php?action=help&modules=query+revisions

export interface GetRevisionsOptions {
  ids: EntityPageTitle | EntityPageTitle[]
  format?: UrlResultFormat
  limit?: number
  start?: Date | string | number
  end?: Date | string | number
  prop?: string | string[]
  user?: string
  excludeuser?: string
  tag?: string
}

export function getRevisionsFactory (buildUrl: BuildUrlFunction) {
  return function getRevisions ({ ids, format, limit, start, end, prop, user, excludeuser, tag }: GetRevisionsOptions) {
    rejectObsoleteInterface(arguments)
    ids = forceArray(ids)
    ids.forEach(o => validate.entityPageTitle(o))

    const uniqueId = ids.length === 1
    const query: ApiQueryParameters = {
      action: 'query',
      prop: 'revisions',
    }

    query.titles = ids.join('|')
    query.format = format || 'json'
    if (uniqueId) query.rvlimit = limit || 'max'
    if (uniqueId && start) query.rvstart = getEpochSeconds(start)
    if (uniqueId && end) query.rvend = getEpochSeconds(end)

    if (prop) {
      query.rvprop = forceArray(prop).join('|')
    } else {
      query.rvprop = 'ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores'
    }
    query.rvslots = '*'
    if (user) query.rvuser = user
    if (excludeuser) query.rvexcludeuser = excludeuser
    if (tag) query.rvtag = tag

    return buildUrl(query)
  }
}

const getEpochSeconds = (date: string | number | Date) => {
  // Return already formatted epoch seconds:
  // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
  // already seconds actually
  if (typeof date === 'number' && date < earliestPointInMs) return date
  return Math.trunc(new Date(date).getTime() / 1000)
}

const earliestPointInMs = new Date('2000-01-01').getTime()
