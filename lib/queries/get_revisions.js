const buildUrl = require('../utils/build_url')
const { forceArray } = require('../utils/utils')

module.exports = function (ids, options = {}) {
  ids = forceArray(ids)
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
  return buildUrl(query)
}

const getEpochSeconds = function (date) {
  // Return already formatted epoch seconds:
  // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
  // already seconds actually
  if (typeof date === 'number' && date < earliestPointInMs) return date
  return Math.trunc(new Date(date).getTime() / 1000)
}

const earliestPointInMs = new Date('2000-01-01').getTime()
