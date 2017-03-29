const toDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isEntityId = (id) => /^(Q|P)[0-9]+$/.test(id)
helpers.isItemId = (id) => /^Q[0-9]+$/.test(id)
helpers.isPropertyId = (id) => /^P[0-9]+$/.test(id)

helpers.wikidataTimeToDateObject = toDateObject

// Try to parse the date or return the input
const bestEffort = (fn) => (value) => {
  try {
    return fn(value)
  } catch (err) {
    return value
  }
}

const toEpochTime = (wikidataTime) => toDateObject(wikidataTime).getTime()
const toISOString = (wikidataTime) => toDateObject(wikidataTime).toISOString()

helpers.wikidataTimeToEpochTime = bestEffort(toEpochTime)
helpers.wikidataTimeToISOString = bestEffort(toISOString)

module.exports = helpers
