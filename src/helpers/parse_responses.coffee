wd_ = require './helpers'
simplifyClaims = require './simplify_claims'

module.exports =
  wd:
    entities: (res)->
      res = res.body or res
      {entities} = res
      for id, entity of entities
        entity.claims = simplifyClaims(entity.claims)
      return entities
  wdq:
    entities: (res)->
      res = res.body or res
      res.items?.map (item)-> wd_.normalizeId(item)
