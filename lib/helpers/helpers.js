const wikidataTimeToDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isEntityId = (id) => /^(Q|P)[0-9]+$/.test(id)
helpers.isItemId = (id) => /^Q[0-9]+$/.test(id)
helpers.isPropertyId = (id) => /^P[0-9]+$/.test(id)

helpers.wikidataTimeToDateObject = wikidataTimeToDateObject

helpers.wikidataTimeToEpochTime = function (wikidataTime) {
  return wikidataTimeToDateObject(wikidataTime).getTime()
}

helpers.wikidataTimeToISOString = function (wikidataTime) {
  return wikidataTimeToDateObject(wikidataTime).toISOString()
}

// keeping normalizeWikidataTime as legacy
helpers.normalizeWikidataTime = helpers.wikidataTimeToEpochTime

module.exports = helpers
