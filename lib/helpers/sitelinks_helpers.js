const { fixedEncodeURIComponent, replaceSpaceByUnderscores, isPlainObject } = require('../utils/utils')
const langPattern = /^[a-z]{2}[a-z_]{0,10}$/
const { isPropertyId } = require('./helpers')
const wikidataBase = 'https://www.wikidata.org/wiki/'

const getSitelinkUrl = (site, title) => {
  if (isPlainObject(site)) {
    title = site.title
    site = site.site
  }

  if (!site) throw new Error('missing a site')
  if (!title) throw new Error('missing a title')

  if (site === 'commons') return `https://commons.wikimedia.org/wiki/${title}`
  if (site === 'wikidata') {
    if (isPropertyId(title)) return `${wikidataBase}Property:${title}`
    return `${wikidataBase}${title}`
  }

  const { lang, project } = getSitelinkData(site)
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
}

const getSitelinkData = site => {
  if (site === 'commons') return { lang: 'en', project: 'commons' }
  if (site === 'wikidata') return { lang: 'en', project: 'wikidata' }
  const [ lang, projectSuffix ] = site.split('wik')
  if (!langPattern.test(lang)) throw new Error(`invalid project lang: ${lang}`)
  const project = projectsBySuffix[projectSuffix]
  if (!project) throw new Error('project not found')
  return { lang, project }
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
