const getEntities = require('./get_entities')
const { isPlainObject } = require('../utils/utils')

module.exports = function (ids, languages, props, format) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    const params = ids
    ids = params.ids
    languages = params.languages
    props = params.props
    format = params.format
  }

  if (!(ids instanceof Array)) throw new Error `getManyEntities expects an array of ids`()

  return getIdsGroups(ids)
  .map((idsGroup) => getEntities(idsGroup, languages, props, format))
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
