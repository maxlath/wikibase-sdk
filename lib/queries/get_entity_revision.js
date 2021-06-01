const validate = require('../helpers/validate')
const { isPlainObject } = require('../utils/utils')

module.exports = (instance, wgScriptPath) => (id, revision) => {
  if (isPlainObject(id)) {
    revision = id.revision
    id = id.id
  }
  validate.entityId(id)
  validate.revisionId(revision)
  return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`
}
