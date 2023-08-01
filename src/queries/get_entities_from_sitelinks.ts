import { type Site, sites } from '../helpers/wikimedia_constants.js'
import { forceArray, rejectObsoleteInterface, isOfType } from '../utils/utils.js'
import type { Props, UrlResultFormat, LanguageCode } from '../types/options.js'
import type { WbGetEntities } from '../types/wbgetentities.js'
import type { BuildUrlFunction, Url } from '../utils/build_url.js'

export interface GetEntitiesFromSitelinksOptions {
  titles: string | string[]
  sites?: Site | Site[]
  languages?: LanguageCode | LanguageCode[]
  props?: Props | Props[]
  format?: UrlResultFormat
  redirects?: boolean
}

export function getEntitiesFromSitelinksFactory (buildUrl: BuildUrlFunction) {
  return function getEntitiesFromSitelinks ({
    titles,
    sites,
    languages,
    props,
    format = 'json',
    redirects,
  }: GetEntitiesFromSitelinksOptions): Url {
    rejectObsoleteInterface(arguments)

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

    const query: WbGetEntities = {
      action: 'wbgetentities',
      titles: titles.join('|'),
      sites: sites.join('|'),
      format,
    }

    // Normalizing only works if there is only one site and title
    if (sites.length === 1 && titles.length === 1) {
      query.normalize = true
    }

    if (languages) {
      languages = forceArray(languages)
      query.languages = languages.join('|')
    }

    if (props.length > 0) {
      query.props = props.join('|')
    }

    if (redirects === false) query.redirects = 'no'

    return buildUrl(query)
  }
}

/** convert language code to Wikipedia sitelink code */
function parseSite (site: Site | LanguageCode): Site {
  if (isOfType(sites, site)) {
    return site
  } else {
    const wiki = site.replace(/-/g, '_') + 'wiki'
    return wiki as Site
  }
}
