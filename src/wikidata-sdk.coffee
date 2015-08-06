module.exports = wdk = require './helpers/helpers'

wdk.searchEntities = require './queries/wikidata_search_entities'
wdk.getEntities = require './queries/wikidata_get_entities'
wdk.getReverseClaims = require './queries/wdq_get_reverse_claims'
wdk.simplifyClaims = require './helpers/simplify_claims'
wdk.parse = require './helpers/parse_responses'
