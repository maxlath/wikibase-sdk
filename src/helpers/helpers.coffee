wikidataTimeToDateObject = require './wikidata_time_to_date_object'

helpers = {}
helpers.isNumericId = (id)-> /^[0-9]+$/.test id
helpers.isWikidataId = (id)-> /^(Q|P)[0-9]+$/.test id
helpers.isWikidataEntityId = (id)-> /^Q[0-9]+$/.test id
helpers.isWikidataPropertyId = (id)-> /^P[0-9]+$/.test id

helpers.normalizeId = (id, numericId, type='Q')->
  if helpers.isNumericId(id)
    if numericId then id
    else "#{type}#{id}"

  else if helpers.isWikidataId(id)
    if numericId then id[1..-1]
    else id

  else throw new Error 'invalid id'

helpers.getNumericId = (id)->
  unless helpers.isWikidataId id then throw new Error "invalid wikidata id: #{id}"
  return id.replace /Q|P/, ''

helpers.normalizeIds = (ids, numericId, type='Q')->
  ids.map (id)-> helpers.normalizeId(id, numericId, type)

helpers.wikidataTimeToDateObject = wikidataTimeToDateObject

helpers.wikidataTimeToEpochTime = (wikidataTime)->
  wikidataTimeToDateObject(wikidataTime).getTime()

helpers.wikidataTimeToISOString = (wikidataTime)->
  wikidataTimeToDateObject(wikidataTime).toISOString()

# keeping normalizeWikidataTime as legacy
helpers.normalizeWikidataTime = helpers.wikidataTimeToEpochTime

module.exports = helpers
