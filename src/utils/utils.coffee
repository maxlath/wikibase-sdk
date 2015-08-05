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

wd_.normalizeIds = (ids, numericId, type='Q')->
  ids.map (id)-> wd_.normalizeId(id, numericId, type)

wd_.wikidataTimeToDateObject = (wikidataTime)->
  sign = wikidataTime[0]
  rest = wikidataTime[1..-1]
  if sign is '-'
    # using ISO8601 expanded notation for negative years: adding 2 leading zeros
    date = "-00#{rest}"
    return new Date(date)
  else
    return new Date(rest)

wd_.wikidataTimeToEpochTime = (wikidataTime)->
  wd_.wikidataTimeToDateObject(wikidataTime).getTime()

wd_.wikidataTimeToISOString = (wikidataTime)->
  wd_.wikidataTimeToDateObject(wikidataTime).toISOString()

# keeping normalizeWikidataTime as legacy
wd_.normalizeWikidataTime = wd_.wikidataTimeToEpochTime

module.exports = wd_
