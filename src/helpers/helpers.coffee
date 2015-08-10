wikidataTimeToDateObject = require './wikidata_time_to_date_object'

wd_ = {}
wd_.isNumericId = (id)-> /^[0-9]+$/.test id
wd_.isWikidataId = (id)-> /^(Q|P)[0-9]+$/.test id
wd_.isWikidataEntityId = (id)-> /^Q[0-9]+$/.test id
wd_.isWikidataPropertyId = (id)-> /^P[0-9]+$/.test id

wd_.normalizeId = (id, numericId, type='Q')->
  if wd_.isNumericId(id)
    if numericId then id
    else "#{type}#{id}"

  else if wd_.isWikidataId(id)
    if numericId then id[1..-1]
    else id

  else throw new Error 'invalid id'

wd_.getNumericId = (id)->
  unless wd_.isWikidataId id then throw new Error "invalid wikidata id: #{id}"
  return id.replace /Q|P/, ''

wd_.normalizeIds = (ids, numericId, type='Q')->
  ids.map (id)-> wd_.normalizeId(id, numericId, type)

wd_.wikidataTimeToDateObject = wikidataTimeToDateObject

wd_.wikidataTimeToEpochTime = (wikidataTime)->
  wikidataTimeToDateObject(wikidataTime).getTime()

wd_.wikidataTimeToISOString = (wikidataTime)->
  wikidataTimeToDateObject(wikidataTime).toISOString()

# keeping normalizeWikidataTime as legacy
wd_.normalizeWikidataTime = wd_.wikidataTimeToEpochTime

module.exports = wd_
