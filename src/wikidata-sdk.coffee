module.exports =
  searchEntities: require './queries/wikidata_search_entities'
  getEntities: require './queries/wikidata_get_entities'
  getReverseClaims: require './queries/wdq_get_reverse_claims'
  simplifyClaims: require './utils/simplify_claims'
  parse: require './utils/parse_responses'
  utils: require './utils/utils'
