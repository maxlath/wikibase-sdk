wd_ = require './helpers'

module.exports = (claims)->
  simpleClaims = {}
  for id, claim of claims
    simpleClaims[id] = simpifyClaim claim
  return simpleClaims

simpifyClaim = (claim)->
  simplifiedClaim = []
  for statement in claim
    simpifiedStatement = simpifyStatement statement
    # filter-out null values
    if simpifiedStatement? then simplifiedClaim.push simpifiedStatement

  return simplifiedClaim

simpifyStatement = (statement)->
  # tries to replace wikidata deep statement object by a simple value
  # e.g. a string, an entity Qid or an epoch time number
  { mainsnak } = statement

  # should only happen in snaktype: "novalue" cases or alikes
  unless mainsnak? then return null

  { datatype, datavalue } = mainsnak
  # known case: snaktype set to "somevalue"
  unless datavalue? then return null

  switch datatype
    when 'string', 'commonsMedia', 'url', 'external-id' then return datavalue.value
    when 'monolingualtext' then return datavalue.value.text
    when 'wikibase-item' then return 'Q' + datavalue.value['numeric-id']
    when 'time' then return wd_.normalizeWikidataTime(datavalue.value.time)
    else return null
