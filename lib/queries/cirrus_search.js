// See https://www.wikidata.org/w/api.php?action=help&modules=query%2Bsearch

const { isPlainObject } = require('../utils/utils')
const namespacePattern = /^\d+[|\d]*$/

module.exports = buildUrl => params => {
  if (!isPlainObject(params)) {
    throw new Error(`expected parameters to be passed as an object, got ${params} (${typeof params})`)
  }

  const { search, statement, format = 'json', limit, offset, profile, sort } = params
  let { namespace } = params

  if (!(search || statement)) throw new Error('missing "search" or "statement" parameter')

  let srsearch = ''
  if (search) srsearch += search

  if (statement) {
    const statements = statement instanceof Array ? statement : [ statement ]
    for (const singleStatement of statements) {
      srsearch += ` haswbstatement:${singleStatement}`
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

  if (profile && !validProfiles.has(profile)) {
    throw new Error(`invalid profile: got ${profile}, expected one of ${Array.from(validProfiles)}`)
  }

  if (sort && !validSort.has(sort)) {
    throw new Error(`invalid sort: got ${sort}, expected one of ${Array.from(validSort)}`)
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
  })
}

const validProfiles = new Set([
  'classic',
  'classic_noboostlinks',
  'empty',
  'engine_autoselect',
  'lexeme_fulltext',
  'lexeme_prefix',
  'popular_inclinks',
  'popular_inclinks_pv',
  'wikibase',
  'wikibase_config_entity_weight',
  'wikibase_config_entity_weight-de',
  'wikibase_config_entity_weight-en',
  'wikibase_config_entity_weight-es',
  'wikibase_config_entity_weight-fr',
  'wikibase_config_phrase',
  'wikibase_phrase',
  'wikibase_prefix',
  'wikibase_prefix_boost',
  'wsum_inclinks',
  'wsum_inclinks_pv',
])

const validSort = new Set([
  'create_timestamp_asc',
  'create_timestamp_desc',
  'incoming_links_asc',
  'incoming_links_desc',
  'just_match',
  'last_edit_asc',
  'last_edit_desc',
  'none',
  'random',
  'relevance',
])
