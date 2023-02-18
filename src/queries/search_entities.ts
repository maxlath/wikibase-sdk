import { EntityTypes } from '../types/entity.js'
import { isOfType, rejectObsoleteInterface } from '../utils/utils.js'
import type { EntityType } from '../types/entity.js'
import type { Url, UrlResultFormat } from '../types/options.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

export interface SearchEntitiesOptions {
  search: string
  language?: string
  limit?: string | number
  continue?: string | number
  format?: UrlResultFormat
  uselang?: string
  type?: EntityType
}

export const searchEntitiesFactory = (buildUrl: BuildUrlFunction) => {
  return function searchEntities ({
    search,
    language = 'en',
    uselang,
    limit = '20',
    continue: continu = '0',
    format = 'json',
    type = 'item',
  }: SearchEntitiesOptions): Url {
    rejectObsoleteInterface(arguments)
    uselang = uselang || language

    if (!(search && search.length > 0)) throw new Error("search can't be empty")
    if (!isOfType(EntityTypes, type)) throw new Error(`invalid type: ${type}`)

    return buildUrl({
      action: 'wbsearchentities',
      search,
      language,
      limit,
      continue: continu,
      format,
      uselang,
      type,
    })
  }
}
