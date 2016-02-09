wd_ = require '../helpers/helpers'
buildUrl = require '../utils/build_url'
{ isPlainObject } = require '../utils/utils'

module.exports = (search, language, limit, format)->
  # polymorphism: arguments can be passed as an object keys
  if isPlainObject search
    { search, language, limit, format } = search

  unless search?.length > 0 then throw new Error "search can't be empty"

  language or= 'en'
  limit or= '20'
  format or= 'json'

  return buildUrl 'wikidata',
    action: 'wbsearchentities'
    search: search
    language: language
    limit: limit
    format: format
