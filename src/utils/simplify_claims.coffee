wd_ = require './utils'

module.exports = (claims)->
  simpleClaims = {}
  for id, claim of claims
    simpleClaims[id] = claim.map simpifyStatement
  return simpleClaims


simpifyStatement = (statement)->
  # tries to replace wikidata deep statement object by a simple value
  # e.g. a string, an entity Qid or an epoch time number
  mainsnak = statement.mainsnak
  if mainsnak?
    [datatype, datavalue] = [mainsnak.datatype, mainsnak.datavalue]
    switch datatype
      when 'string', 'commonsMedia' then value = datavalue.value
      when 'wikibase-item' then value = 'Q' + datavalue.value['numeric-id']
      when 'time' then value = wd_.normalizeWikidataTime(datavalue.value.time)
      else value = null
    return value
  else
    # should only happen in snaktype: "novalue" cases or alikes
    return
