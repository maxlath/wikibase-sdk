const { simplifyEntity } = require('./simplify_entity')

const wb = {
  entities: res => {
    // Legacy convenience for the time the 'request' lib was all the rage
    res = res.body || res
    const { entities } = res
    Object.keys(entities).forEach(entityId => {
      entities[entityId] = simplifyEntity(entities[entityId])
    })
    return entities
  },

  pagesTitles: res => {
    // Same behavior as above
    res = res.body || res
    return res.query.search.map(result => result.title)
  }
}

module.exports = {
  wb,
  // Legacy
  wd: wb
}
