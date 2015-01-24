wd_ = require '../utils/utils'
buildUrl = require '../utils/build_url'

module.exports = (search, language='en', limit='20', format='json')->
  # search can not be let empty
  unless search?.length > 0 then throw new Error "search can't be undefined"

  query =
    action: 'wbsearchentities'
    search: search
    language: language
    limit: limit
    format: format

  return buildUrl 'wikidata', query