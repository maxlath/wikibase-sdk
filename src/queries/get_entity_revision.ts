import validate from '../helpers/validate.js'
import { isPlainObject } from '../utils/utils.js'

export const GetEntityRevision = (instance, wgScriptPath) => (id, revision) => {
  if (isPlainObject(id)) {
    revision = id.revision
    id = id.id
  }
  validate.entityId(id)
  validate.revisionId(revision)
  return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`
}
