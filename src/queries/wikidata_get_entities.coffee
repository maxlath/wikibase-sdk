wd_ = require '../utils/utils'
buildUrl = require '../utils/build_url'
{ forceArray, shortLang } = require '../utils/misc'

module.exports = (ids, languages=['en'], props, format='json')->
  # ids cant be let empty
  unless ids? or ids.length is 0 then throw new Error 'no id provided'

  # properties can be either one property as a string or an array or properties
  # either case me just want to deal with arrays
  ids = wd_.normalizeIds forceArray(ids)
  languages = forceArray(languages).map shortLang
  props = forceArray props

  # add English to have fallbacks values
  unless 'en' in languages then languages.push 'en'

  query =
    action: 'wbgetentities'
    ids: ids.join '|'
    languages: languages.join '|'
    format: format

  if props?.length > 0 then query.props = props.join '|'

  return buildUrl 'wikidata', query
