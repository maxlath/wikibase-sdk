// See https://www.wikidata.org/w/api.php?action=help&modules=query%2Bsearch

import { isAKey, rejectObsoleteInterface } from '../utils/utils.js'
import type { Url, UrlResultFormat } from '../types/options.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

const namespacePattern = /^\d+[|\d]*$/

export interface CirrusSearchPagesOptions {
  search?: string
  haswbstatement?: string | string[]
  limit?: string | number
  offset?: string | number
  format?: UrlResultFormat
  profile?: string
  sort?: string
  namespace?: string | string[] | number | number[]
  prop?: string | string[]
}

export function cirrusSearchPagesFactory (buildUrl: BuildUrlFunction) {
  return function cirrusSearchPages (options: CirrusSearchPagesOptions): Url {
    rejectObsoleteInterface(arguments)

    // Accept sr parameters with or without prefix
    for (const [ key, value ] of Object.entries(options)) {
      if (key.startsWith('sr')) {
        const shortKey = key.replace(/^sr/, '')
        if (!isAKey(options, shortKey)) throw new Error(`${key} is not a valid option`)
        if (options[shortKey] != null) throw new Error(`${shortKey} and ${key} are the same`)
        options[shortKey] = value
      }
    }

    const { search, haswbstatement, format = 'json', limit, offset, profile, sort } = options
    let { namespace, prop } = options

    if (!(search || haswbstatement)) throw new Error('missing "search" or "haswbstatement" parameter')

    let srsearch = ''
    if (search) srsearch += search

    if (haswbstatement) {
      const statements = haswbstatement instanceof Array ? haswbstatement : [ haswbstatement ]
      for (const statement of statements) {
        if (statement[0] === '-') srsearch += ` -haswbstatement:${statement.slice(1)}`
        else srsearch += ` haswbstatement:${statement}`
      }
    }

    if (limit != null && (typeof limit !== 'number' || limit < 1)) {
      throw new Error(`invalid limit: ${limit}`)
    }

    if (offset != null && (typeof offset !== 'number' || offset < 0)) {
      throw new Error(`invalid offset: ${offset}`)
    }

    if (namespace instanceof Array) namespace = namespace.join('|')
    else if (typeof namespace === 'number') namespace = namespace.toString()

    if (namespace && !namespacePattern.test(namespace)) {
      throw new Error(`invalid namespace: ${namespace}`)
    }

    if (profile != null && typeof profile !== 'string') {
      throw new Error(`invalid profile: ${profile} (${typeof profile}, expected string)`)
    }

    if (sort != null && typeof sort !== 'string') {
      throw new Error(`invalid sort: ${sort} (${typeof sort}, expected string)`)
    }

    let srprop
    if (prop != null) {
      if (prop instanceof Array) prop = prop.join('|')
      if (typeof prop !== 'string') {
        throw new Error(`invalid prop: ${prop} (${typeof prop}, expected string)`)
      }
      srprop = prop.toString()
    }

    return buildUrl({
      action: 'query',
      list: 'search',
      srsearch: srsearch.trim(),
      format,
      srnamespace: namespace,
      srlimit: limit,
      sroffset: offset,
      srqiprofile: profile,
      srsort: sort,
      srprop,
    })
  }
}
