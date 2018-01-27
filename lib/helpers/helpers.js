const toDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isNumericId = id => /^[0-9]+$/.test(id)
helpers.isEntityId = id => /^(Q|P)[0-9]+$/.test(id)
helpers.isItemId = id => /^Q[0-9]+$/.test(id)
helpers.isPropertyId = id => /^P[0-9]+$/.test(id)

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
    console.error('wikidata-sdk time conversion error:', err)
    return value
  }
}

const toEpochTime = wikidataTime => toDateObject(wikidataTime).getTime()
const toISOString = wikidataTime => toDateObject(wikidataTime).toISOString()

// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
const toSimpleDay = wikidataTime => {
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

module.exports = helpers
