wd_ = require './helpers'

# expects an entity 'claims' object
simplifyClaims = (claims)->
  simpleClaims = {}
  for id, propClaims of claims
    simpleClaims[id] = simplifyPropertyClaims propClaims
  return simpleClaims

# expects the 'claims' array of a particular property
simplifyPropertyClaims = (propClaims)->
  propClaims
  .map simplifyClaim
  .filter nonNull

nonNull = (obj)-> obj?

# expects a single claim object
simplifyClaim = (claim)->
  # tries to replace wikidata deep claim object by a simple value
  # e.g. a string, an entity Qid or an epoch time number
  { mainsnak } = claim

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


module.exports =
  simplifyClaims: simplifyClaims
  simplifyPropertyClaims: simplifyPropertyClaims
  simplifyClaim: simplifyClaim
