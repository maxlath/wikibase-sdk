module.exports = wdk = {}

helpers = require './helpers/helpers'

wdk.searchEntities = require './queries/wikidata_search_entities'
wdk.getEntities = require './queries/wikidata_get_entities'
wdk.getReverseClaims = require './queries/wdq_get_reverse_claims'
wdk.simplifyClaims = require './helpers/simplify_claims'
wdk.parse = require './helpers/parse_responses'

# making helpers both available from root
# and from wdk.helpers
wdk.helpers = helpers
# equivalent to _.extend wdk, helpers
for k, v of helpers
  wdk[k] = v
