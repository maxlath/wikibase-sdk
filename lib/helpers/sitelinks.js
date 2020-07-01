const { fixedEncodeURIComponent, replaceSpaceByUnderscores, isPlainObject } = require('../utils/utils')
const { isPropertyId } = require('./helpers')
const wikidataBase = 'https://www.wikidata.org/wiki/'
const languages = require('./sitelinks_languages')

const getSitelinkUrl = (site, title) => {
  if (isPlainObject(site)) {
    title = site.title
    site = site.site
  }

  if (!site) throw new Error('missing a site')
  if (!title) throw new Error('missing a title')

  const shortSiteKey = site.replace(/wiki$/, '')
  const specialUrlBuilder = siteUrlBuilders[shortSiteKey] || siteUrlBuilders[site]
  if (specialUrlBuilder) return specialUrlBuilder(title)

  const { lang, project } = getSitelinkData(site)
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
}

const wikimediaSite = subdomain => title => `https://${subdomain}.wikimedia.org/wiki/${title}`

const siteUrlBuilders = {
  commons: wikimediaSite('commons'),
  mediawiki: title => `https://www.mediawiki.org/wiki/${title}`,
  meta: wikimediaSite('meta'),
  species: wikimediaSite('species'),
  wikidata: title => {
    if (isPropertyId(title)) return `${wikidataBase}Property:${title}`
    return `${wikidataBase}${title}`
  },
  wikimania: wikimediaSite('wikimania')
}

const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/

const getSitelinkData = site => {
  if (site.startsWith('http')) {
    const url = site
    const matchData = url.match(sitelinkUrlPattern)
    if (!matchData) throw new Error(`invalid sitelink url: ${url}`)
    let [ lang, project, title ] = matchData.slice(1)
    title = decodeURIComponent(title)
    let key
    // Known case: wikidata, mediawiki
    if (lang === 'www') {
      lang = 'en'
      key = project
    } else if (lang === 'commons') {
      lang = 'en'
      project = key = 'commons'
    } else {
      key = `${lang}${project}`.replace('wikipedia', 'wiki')
    }
    return { lang, project, key, title, url }
  } else {
    const key = site
    const specialProjectName = specialSites[key]
    if (specialProjectName) return { lang: 'en', project: specialProjectName, key }

    const [ lang, projectSuffix, rest ] = key.split('wik')

    // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
    if (rest != null) throw new Error(`invalid sitelink key: ${key}`)

    if (languages.indexOf(lang) === -1) {
      throw new Error(`sitelink lang not found: ${lang}`)
    }

    const project = projectsBySuffix[projectSuffix]
    if (!project) throw new Error(`sitelink project not found: ${project}`)

    return { lang, project, key }
  }
}

const specialSites = {
  commonswiki: 'commons',
  mediawikiwiki: 'mediawiki',
  metawiki: 'meta',
  specieswiki: 'specieswiki',
  wikidatawiki: 'wikidata',
  wikimaniawiki: 'wikimania'
}

const isSitelinkKey = site => {
  try {
    // relies on getSitelinkData validation
    getSitelinkData(site)
    return true
  } catch (err) {
    return false
  }
}

const projectsBySuffix = {
  i: 'wikipedia',
  isource: 'wikisource',
  iquote: 'wikiquote',
  tionary: 'wiktionary',
  ibooks: 'wikibooks',
  iversity: 'wikiversity',
  ivoyage: 'wikivoyage',
  inews: 'wikinews'
}

module.exports = { getSitelinkUrl, getSitelinkData, isSitelinkKey }
