const { fixedEncodeURIComponent, replaceSpaceByUnderscores, isPlainObject } = require('../utils/utils')

const getSitelinkUrl = (site, title) => {
  if (isPlainObject(site)) {
    title = site.title
    site = site.site
  }

  if (!site) throw new Error('missing a site')
  if (!title) throw new Error('missing a title')

  if (site === 'commons') {
    return `https://commons.wikimedia.org/wiki/${title}`
  }

  const { lang, project } = getSitelinkData(site)
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
}

const getSitelinkData = site => {
  if (site === 'commons') return { lang: 'en', project: 'commons' }
  const [ lang, projectSuffix ] = site.split('wik')
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
