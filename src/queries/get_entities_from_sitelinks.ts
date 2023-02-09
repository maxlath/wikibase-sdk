import { forceArray, shortLang, rejectObsoleteInterface } from '../utils/utils.js'
import type { Props, Url, UrlResultFormat, WmLanguageCode } from '../types/options.js'
import type { Site } from '../types/sitelinks.js'
import type { wbgetentities } from '../types/wbgetentities.js'
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
    // @ts-ignore
    props = forceArray(props)

    const query: wbgetentities = {
      action: 'wbgetentities',
      titles: titles.join('|'),
      sites: sites.join('|'),
      format,
    }

    // Normalizing only works if there is only one site and title
    if (sites.length === 1 && titles.length === 1) {
      query.normalize = '1'
    }

    if (languages) {
      languages = forceArray(languages).map(shortLang)
      query.languages = languages.join('|')
    }

    if (props && props.length > 0 && typeof props === 'object') {
      query.props = props.join('|')
    }

    if (redirects === false) query.redirects = 'no'

    return buildUrl(query)
  }
}

// convert 2 letters language code to Wikipedia sitelinks code
const parseSite = (site: string) => (site.length === 2 ? `${site}wiki` : site)
