wd_ = require '../helpers/helpers'
buildUrl = require '../utils/build_url'

module.exports = (search, language='en', limit='20', format='json')->
  # search can not be let empty
  unless search?.length > 0 then throw new Error "search can't be undefined"

  return buildUrl 'wikidata',
    action: 'wbsearchentities'
    search: search
    language: language
    limit: limit
    format: format
