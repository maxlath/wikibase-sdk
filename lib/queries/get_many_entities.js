const getEntities = require('./get_entities')
const { isPlainObject } = require('../utils/utils')

module.exports = function (ids, languages, props, format) {
  // Polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    ({ ids, languages, props, format } = ids)
  }

  if (!(ids instanceof Array)) throw new Error('getManyEntities expects an array of ids')

  return getIdsGroups(ids)
  .map(idsGroup => getEntities(idsGroup, languages, props, format))
}

const getIdsGroups = function (ids) {
  const groups = []
  while (ids.length > 0) {
    let group = ids.slice(0, 50)
    ids = ids.slice(50)
    groups.push(group)
  }
  return groups
}
