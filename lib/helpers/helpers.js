const toDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isNumericId = id => /^[0-9]+$/.test(id)
helpers.isEntityId = id => /^(Q|P)[0-9]+$/.test(id)
helpers.isItemId = id => /^Q[0-9]+$/.test(id)
helpers.isPropertyId = id => /^P[0-9]+$/.test(id)
helpers.isGuid = guid => /^(Q|P|L)\d+\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid)

helpers.getNumericId = function (id) {
  if (!(helpers.isEntityId(id))) throw new Error(`invalid wikidata id: ${id}`)
  return id.replace(/Q|P/, '')
}

helpers.wikidataTimeToDateObject = toDateObject

// Try to parse the date or return the input
const bestEffort = fn => value => {
  try {
    return fn(value)
  } catch (err) {
    value = value.time || value
    return value.replace('-00-00', '-01-01')
  }
}

const toEpochTime = wikidataTime => toDateObject(wikidataTime).getTime()
const toISOString = wikidataTime => toDateObject(wikidataTime).toISOString()

// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
const toSimpleDay = wikidataTime => {
  // Also accept claim datavalue.value objects, and actually prefer those,
  // as we can check the precision
  if (typeof wikidataTime === 'object') {
    const { time, precision } = wikidataTime
    // Year precision
    if (precision === 9) wikidataTime = time.replace('-01-01T', '-00-00T')
    // Month precision
    else if (precision === 10) wikidataTime = time.replace('-01T', '-00T')
    else wikidataTime = time
  }

  return wikidataTime.split('T')[0]
  // Remove positive years sign
  .replace(/^\+/, '')
  // Remove years padding zeros
  .replace(/^(-?)0+/, '$1')
  // Remove days if not included in the Wikidata date precision
  .replace(/-00$/, '')
  // Remove months if not included in the Wikidata date precision
  .replace(/-00$/, '')
}

helpers.wikidataTimeToEpochTime = bestEffort(toEpochTime)
helpers.wikidataTimeToISOString = bestEffort(toISOString)
helpers.wikidataTimeToSimpleDay = bestEffort(toSimpleDay)

helpers.getImageUrl = (filename, width) => {
  var url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`
  if (typeof width === 'number') url += `?width=${width}`
  return url
}

module.exports = helpers
