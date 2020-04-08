const { forceArray } = require('../utils/utils')
const validate = require('../helpers/validate')

module.exports = buildUrl => (ids, options = {}) => {
  ids = forceArray(ids)
  ids.forEach(validate.entityPageTitle)

  const uniqueId = ids.length === 1
  const query = {
    action: 'query',
    prop: 'revisions'
  }

  query.titles = ids.join('|')
  query.format = options.format || 'json'
  if (uniqueId) query.rvlimit = options.limit || 'max'
  if (uniqueId && options.start) query.rvstart = getEpochSeconds(options.start)
  if (uniqueId && options.end) query.rvend = getEpochSeconds(options.end)

  const { prop, user, excludeuser, tag } = options
  if (prop) query.rvprop = forceArray(prop).join('|')
  if (user) query.rvuser = user
  if (excludeuser) query.rvexcludeuser = excludeuser
  if (tag) query.rvtag = tag

  return buildUrl(query)
}

const getEpochSeconds = date => {
  // Return already formatted epoch seconds:
  // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
  // already seconds actually
  if (typeof date === 'number' && date < earliestPointInMs) return date
  return Math.trunc(new Date(date).getTime() / 1000)
}

const earliestPointInMs = new Date('2000-01-01').getTime()
