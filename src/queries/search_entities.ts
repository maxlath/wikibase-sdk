import type { SearchType, Url, UrlResultFormat } from '../types/options.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

const types = [ 'item', 'property', 'lexeme', 'form', 'sense' ]

export const searchEntitiesFactory = (buildUrl: BuildUrlFunction) => {
  return function ({
    search,
    language = 'en',
    uselang,
    limit = '20',
    continue: continu = '0',
    format = 'json',
    type = 'item',
  }: {
    search: string;
    language?: string;
    limit?: string | number;
    continue?: string | number;
    format?: UrlResultFormat;
    uselang?: string;
    type?: SearchType;
  }): Url {
    uselang = uselang || language

    if (!(search && search.length > 0)) throw new Error("search can't be empty")
    if (!types.includes(type)) throw new Error(`invalid type: ${type}`)

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
