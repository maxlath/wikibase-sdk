wd_ = require '../helpers/helpers'
buildUrl = require '../utils/build_url'
{ isPlainObject, forceArray, shortLang } = require '../utils/utils'

module.exports = (ids, languages, props, format)->
  # polymorphism: arguments can be passed as an object keys
  if isPlainObject ids
    { ids, languages, props, format } = ids

  format or= 'json'

  # ids cant be let empty
  unless ids? or ids.length is 0 then throw new Error 'no id provided'
  if ids.length > 50
    console.warn """getEntities accepts 50 ids max to match Wikidata API limitations:
      this request won't get all the desired entities.
      You can use getManyEntities instead to generate several request urls
      to work around this limitation"""

  # Properties can be either one property as a string
  # or an array or properties;
  # either case me just want to deal with arrays
  ids = wd_.normalizeIds forceArray(ids)
  props = forceArray props

  query =
    action: 'wbgetentities'
    ids: ids.join '|'
    format: format

  if languages?
    languages = forceArray(languages).map shortLang
    query.languages = languages.join '|'

  if props?.length > 0 then query.props = props.join '|'

  return buildUrl 'wikidata', query
