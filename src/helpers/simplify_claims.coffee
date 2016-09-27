helpers = require './helpers'

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
    when 'wikibase-item', 'wikibase-property' then return datavalue.value.id
    when 'time' then return helpers.normalizeWikidataTime datavalue.value.time
    when 'quantity' then parseFloat datavalue.value.amount
    when 'globe-coordinate' then return getLatLngFromCoordinates datavalue.value
    else return null

getLatLngFromCoordinates = (value)->
  { latitude, longitude } = value
  return [ latitude, longitude ]

module.exports =
  simplifyClaims: simplifyClaims
  simplifyPropertyClaims: simplifyPropertyClaims
  simplifyClaim: simplifyClaim
