import { languages } from '../helpers/sitelinks_languages.js'
import { forceArray, shortLang, rejectObsoleteInterface, isOfType } from '../utils/utils.js'
import type { Props, Url, UrlResultFormat, WmLanguageCode } from '../types/options.js'
import type { Site } from '../types/sitelinks.js'
import type { WbGetEntities } from '../types/wbgetentities.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

export interface GetEntitiesFromSitelinksOptions {
  titles: string | string[]
  sites?: Site | Site[]
  languages?: WmLanguageCode | WmLanguageCode[]
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
      languages = forceArray(languages).map(shortLang)
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
function parseSite (site: Site | WmLanguageCode): Site {
  if (isOfType(languages, site)) {
    // The `as Site` conversion shouldnt be needed but WmLanguageCode and Site do not seem to be perfectly in sync?
    // Both are created by scripts so this is also out of sync on the Wikimedia projects?
    return `${site}wiki` as Site
  } else {
    return site
  }
}
