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
  }
}

const getSitelinkData = site => {
  const specialProjectName = specialSites[site]
  if (specialProjectName) return { lang: 'en', project: specialProjectName }

  const [ lang, projectSuffix, rest ] = site.split('wik')

  // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
  if (rest != null) throw new Error(`invalid sitelink: ${site}`)

  if (languages.indexOf(lang) === -1) {
    throw new Error(`sitelink lang not found: ${lang}`)
  }

  const project = projectsBySuffix[projectSuffix]
  if (!project) throw new Error(`sitelink project not found: ${project}`)

  return { lang, project }
}

const specialSites = {
  commonswiki: 'commons',
  mediawikiwiki: 'mediawiki',
  metawiki: 'meta',
  specieswiki: 'specieswiki',
  wikidatawiki: 'wikidata'
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
