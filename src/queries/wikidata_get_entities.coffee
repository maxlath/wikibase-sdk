wd_ = require '../helpers/helpers'
buildUrl = require '../utils/build_url'
{ forceArray, shortLang } = require '../utils/utils'

module.exports = (ids, languages, props, format='json')->
  # ids cant be let empty
  unless ids? or ids.length is 0 then throw new Error 'no id provided'

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
