const simplifyClaims = require('./simplify_claims')

module.exports = {
  wd: {
    entities: function(res) {
      res = res.body || res
      const { entities } = res
      for (let id in entities) {
        let entity = entities[id]
        entity.claims = simplifyClaims(entity.claims)
      }
      return entities
    }
  }
}
