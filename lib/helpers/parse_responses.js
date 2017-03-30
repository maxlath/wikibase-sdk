const simplifyEntity = require('./simplify_entity')

module.exports = {
  wd: {
    entities: function (res) {
      res = res.body || res
      const { entities } = res
      Object.keys(entities).forEach(entityId => {
        entities[entityId] = simplifyEntity(entities[entityId])
      })
      return entities
    }
  }
}
