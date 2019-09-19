const { isPlainObject, forceArray, shortLang } = require('../utils/utils')

module.exports = buildUrl => (titles, sites, languages, props, format, redirects) => {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(titles)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    const params = titles
    titles = params.titles
    sites = params.sites
    languages = params.languages
    props = params.props
    format = params.format
    redirects = params.redirects
  }

  format = format || 'json'

  // titles cant be let empty
  if (!(titles && titles.length > 0)) throw new Error('no titles provided')
  // default to the English Wikipedia
  if (!(sites && sites.length > 0)) sites = [ 'enwiki' ]

  // Properties can be either one property as a string
  // or an array or properties;
  // either case me just want to deal with arrays
  titles = forceArray(titles)
  sites = forceArray(sites).map(parseSite)
  props = forceArray(props)

  const query = {
    action: 'wbgetentities',
    titles: titles.join('|'),
    sites: sites.join('|'),
    format
  }

  // Normalizing only works if there is only one site and title
  if (sites.length === 1 && titles.length === 1) {
    query.normalize = true
  }

  if (languages) {
    languages = forceArray(languages).map(shortLang)
    query.languages = languages.join('|')
  }

  if (props && props.length > 0) query.props = props.join('|')

  if (redirects === false) query.redirects = 'no'

  return buildUrl(query)
}

// convert 2 letters language code to Wikipedia sitelinks code
const parseSite = site => site.length === 2 ? `${site}wiki` : site
