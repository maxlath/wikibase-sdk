simplifyClaims = require './simplify_claims'

module.exports =
  wd:
    entities: (res)->
      res = res.body or res
      {entities} = res
      for id, entity of entities
        entity.claims = simplifyClaims(entity.claims)
      return entities
