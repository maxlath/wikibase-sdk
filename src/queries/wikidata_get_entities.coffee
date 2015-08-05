wd_ = require '../utils/utils'
buildUrl = require '../utils/build_url'

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


# languages have to be 2-letters language codes
shortLang = (language)-> language[0..2]

# a polymorphism helper: accept either a string or an array and return an array
forceArray = (array)->
  if typeof array is 'string' then array = [array]
  return array or []
