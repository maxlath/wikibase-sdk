const { isEntityId, isRevisionId } = require('../helpers/helpers')
const { isPlainObject } = require('../utils/utils')

module.exports = (id, revision) => {
  if (isPlainObject(id)) {
    revision = id.revision
    id = id.id
  }
  if (!isEntityId(id)) throw new Error(`invalid entity id: ${id}`)
  if (!isRevisionId(revision)) throw new Error(`invalid revision id: ${revision}`)
  return `https://www.wikidata.org/w/index.php?title=Special:EntityData/${id}.json&oldid=${revision}`
}
