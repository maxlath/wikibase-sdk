const { fixedEncodeURIComponent, replaceSpaceByUnderscores } = require('../utils/utils')

module.exports = (site, title) => {
  if (site === 'commons') {
    return `https://commons.wikimedia.org/wiki/${title}`
  }

  const [ lang, projectSuffix ] = site.split('wik')
  const project = projectsBySuffix[projectSuffix]
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
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
