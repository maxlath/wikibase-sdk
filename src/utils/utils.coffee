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

wd_.normalizeWikidataTime = (wikidataTime)->
  # wikidata time looks like: '+00000001862-01-01T00:00:00Z'
  # or "-00000000427-01-01T00:00:00Z" for BC dates
  # normalizeWikidataTime returns epoch time in milliseconds
  # witch can then be easily converted by javascript's Date object
  parts = wikidataTime.split '-'
  switch parts.length
    when 3
      [year, month, rest] = parts
    when 4
      [sign, year, month, rest] = parts
      year = "-" + year
    else console.error "unknown wikidata time format"
  day = rest[0..1]
  return new Date(year, month, day).getTime()

wd_.toPropertiesArray = (obj)->
  if typeof obj is 'string' then obj = [obj]
  else obj or []

module.exports = wd_