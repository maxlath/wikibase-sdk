const wikidataTimeToDateObject = require('./wikidata_time_to_date_object')

const helpers = {}
helpers.isNumericId = (id) => /^[0-9]+$/.test(id)
helpers.isWikidataId = (id) => /^(Q|P)[0-9]+$/.test(id)
helpers.isWikidataEntityId = (id) => /^Q[0-9]+$/.test(id)
helpers.isWikidataPropertyId = (id) => /^P[0-9]+$/.test(id)

helpers.normalizeId = function (id, numericId, type = 'Q') {
  if (helpers.isNumericId(id)) {
    return numericId ? id : `${type}${id}`
  } else if (helpers.isWikidataId(id)) {
    return numericId ? id.slice(1) : id
  } else {
    throw new Error('invalid id')
  }
}

helpers.getNumericId = function (id) {
  if (!(helpers.isWikidataId(id))) throw new Error(`invalid wikidata id: ${id}`)
  return id.replace(/Q|P/, '')
}

helpers.normalizeIds = function (ids, numericId, type = 'Q') {
  return ids.map((id) => helpers.normalizeId(id, numericId, type))
}

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
