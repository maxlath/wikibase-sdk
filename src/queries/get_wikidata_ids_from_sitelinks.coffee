buildUrl = require '../utils/build_url'
{ isPlainObject, forceArray, shortLang } = require '../utils/utils'

module.exports = (titles, sites, languages, props, format)->
  # polymorphism: arguments can be passed as an object keys
  if isPlainObject titles
    { titles, sites, languages, props, format } = titles

  format or= 'json'

  # titles cant be let empty
  if (not titles?) or titles.length is 0 then throw new Error 'no title provided'
  if (not sites?) or sites.length is 0
    # default to the English Wikipedia
    sites = [ 'enwiki' ]

  # Properties can be either one property as a string
  # or an array or properties;
  # either case me just want to deal with arrays
  titles = forceArray titles
  sites = forceArray(sites).map parseSite
  props = forceArray props

  query =
    action: 'wbgetentities'
    titles: titles.join '|'
    sites: sites.join '|'
    format: format

  if languages?
    languages = forceArray(languages).map shortLang
    query.languages = languages.join '|'

  if props?.length > 0 then query.props = props.join '|'

  return buildUrl 'wikidata', query

parseSite = (site)->
  # convert 2 letters language code to Wikipedia sitelinks code
  if site.length is 2 then "#{site}wiki"
  else site
