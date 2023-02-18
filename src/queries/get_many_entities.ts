import { rejectObsoleteInterface } from '../utils/utils.js'
import { getEntitiesFactory } from './get_entities.js'
import type { GetEntitiesOptions } from './get_entities.js'
import type { EntityId } from '../types/entity.js'
import type { Url } from '../types/options.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

export interface GetManyEntitiesOptions extends GetEntitiesOptions {
  ids: EntityId[]
}

export function getManyEntitiesFactory (buildUrl: BuildUrlFunction) {
  const getEntities = getEntitiesFactory(buildUrl)
  return function getManyEntities ({ ids, languages, props, format, redirects }: GetManyEntitiesOptions): Url[] {
    rejectObsoleteInterface(arguments)
    if (!(ids instanceof Array)) throw new Error('getManyEntities expects an array of ids')
    return getChunks(ids)
      .map(idsGroup => getEntities({ ids: idsGroup, languages, props, format, redirects }))
  }
}

function getChunks<T extends string> (ids: readonly T[]): T[][] {
  const chunks = []
  while (ids.length > 0) {
    const chunk = ids.slice(0, 50)
    ids = ids.slice(50)
    chunks.push(chunk)
  }
  return chunks
}
