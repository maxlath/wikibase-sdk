const toDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isEntityId = (id) => /^(Q|P)[0-9]+$/.test(id)
helpers.isItemId = (id) => /^Q[0-9]+$/.test(id)
helpers.isPropertyId = (id) => /^P[0-9]+$/.test(id)

helpers.wikidataTimeToDateObject = toDateObject

helpers.wikidataTimeToEpochTime = function (wikidataTime) {
  return toDateObject(wikidataTime).getTime()
}

helpers.wikidataTimeToISOString = function (wikidataTime) {
  return toDateObject(wikidataTime).toISOString()
}

module.exports = helpers
