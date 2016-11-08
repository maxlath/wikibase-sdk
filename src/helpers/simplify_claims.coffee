helpers = require './helpers'

# Expects an entity 'claims' object
# Ex: entity.claims
simplifyClaims = (claims, entityPrefix, propertyPrefix)->
  simpleClaims = {}
  for id, propClaims of claims
    if propertyPrefix then id = "#{propertyPrefix}:#{id}"
    simpleClaims[id] = simplifyPropertyClaims propClaims, entityPrefix, propertyPrefix
  return simpleClaims

# Expects the 'claims' array of a particular property
# Ex: entity.claims.P369
simplifyPropertyClaims = (propClaims, entityPrefix, propertyPrefix)->
  propClaims
  .map (claim)-> simplifyClaim claim, entityPrefix, propertyPrefix
  .filter nonNull

nonNull = (obj)-> obj?

# Expects a single claim object
# Ex: entity.claims.P369[0]
simplifyClaim = (claim, entityPrefix, propertyPrefix)->
  # tries to replace wikidata deep claim object by a simple value
  # e.g. a string, an entity Qid or an epoch time number
  { mainsnak } = claim

  # should only happen in snaktype: "novalue" cases or alikes
  unless mainsnak? then return null

  { datatype, datavalue } = mainsnak
  # known case: snaktype set to "somevalue"
  unless datavalue? then return null

  switch datatype
    when 'string', 'commonsMedia', 'url', 'external-id' then datavalue.value
    when 'monolingualtext' then datavalue.value.text
    when 'wikibase-item' then prefixedId datavalue, entityPrefix
    when 'wikibase-property' then prefixedId datavalue, propertyPrefix
    when 'time' then helpers.normalizeWikidataTime datavalue.value.time
    when 'quantity' then parseFloat datavalue.value.amount
    when 'globe-coordinate' then getLatLngFromCoordinates datavalue.value
    else null

prefixedId = (datavalue, prefix)->
  { id } = datavalue.value
  if typeof prefix is 'string' then "#{prefix}:#{id}" else id

getLatLngFromCoordinates = (value)->
  { latitude, longitude } = value
  return [ latitude, longitude ]

module.exports =
  simplifyClaims: simplifyClaims
  simplifyPropertyClaims: simplifyPropertyClaims
  simplifyClaim: simplifyClaim
