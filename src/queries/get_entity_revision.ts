import * as validate from '../helpers/validate.js'
import { rejectObsoleteInterface } from '../utils/utils.js'
import type { EntityId, RevisionId } from '../types/entity.js'
import type { Url } from '../types/options.js'

export interface GetEntityRevisionOptions {
  id: EntityId
  revision: RevisionId
}

export function getEntityRevisionFactory (instance: Url, wgScriptPath: string) {
  return function getEntityRevision ({ id, revision }: GetEntityRevisionOptions): Url {
    rejectObsoleteInterface(arguments)
    validate.entityId(id)
    validate.revisionId(revision)
    return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`
  }
}
