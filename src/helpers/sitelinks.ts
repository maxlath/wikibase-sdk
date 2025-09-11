import { fixedEncodeURIComponent, isAKey, isOfType, rejectObsoleteInterface, replaceSpaceByUnderscores } from '../utils/utils.js'
import { specialSites, type Site, sites } from './wikimedia_constants.js'
import type { LanguageCode } from '../types/options.js'
import type { Url } from '../utils/build_url.js'

const wikidataBase = 'https://www.wikidata.org/wiki/'

type ValueOf<T> = T[keyof T]
type SpecialSiteProjectName = ValueOf<typeof specialSites>

export interface GetSitelinkUrlOptions {
  site: Site | SpecialSiteProjectName
  title: string
}

export function getSitelinkUrl ({ site, title }: GetSitelinkUrlOptions): Url {
  // eslint-disable-next-line prefer-rest-params
  rejectObsoleteInterface(arguments)

  if (!site) throw new Error('missing a site')
  if (!title) throw new Error('missing a title')

  if (isAKey(siteUrlBuilders, site)) {
    return siteUrlBuilders[site](title)
  }

  const shortSiteKey = site.replace(/wiki$/, '')
  if (isAKey(siteUrlBuilders, shortSiteKey)) {
    return siteUrlBuilders[shortSiteKey](title)
  }

  const { lang, project } = getSitelinkData(site)
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
}

const wikimediaSite = (subdomain: string) => (title: string) => `https://${subdomain}.wikimedia.org/wiki/${title}`

const siteUrlBuilders: Readonly<Record<SpecialSiteProjectName, (s: string) => string>> = {
  commons: wikimediaSite('commons'),
  foundation: wikimediaSite('foundation'),
  mediawiki: title => `https://www.mediawiki.org/wiki/${title}`,
  meta: wikimediaSite('meta'),
  outreach: wikimediaSite('outreach'),
  sources: title => `https://wikisource.org/wiki/${title}`,
  species: wikimediaSite('species'),
  wikidata: entityId => {
    const prefix = prefixByEntityLetter[entityId[0]]
    let title = prefix ? `${prefix}:${entityId}` : entityId
    // Required for forms and senses
    title = title.replace('-', '#')
    return `${wikidataBase}${title}`
  },
  wikifunctions: wikimediaSite('wikifunctions'),
  wikimania: wikimediaSite('wikimania'),
}

const prefixByEntityLetter = {
  E: 'EntitySchema',
  L: 'Lexeme',
  P: 'Property',
} as const

const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/

export interface SitelinkData {
  lang: LanguageCode
  project: Project
  key: string
  title?: string
  url?: Url
}

export function getSitelinkData (site: Site | Url): SitelinkData {
  if (site.startsWith('http')) {
    const url = site
    const matchData = url.match(sitelinkUrlPattern)
    if (!matchData) throw new Error(`invalid sitelink url: ${url}`)
    let [ lang, project, title ] = matchData.slice(1)
    title = decodeURIComponent(title)
    if (lang === 'commons') {
      return { lang: 'en', project: 'commons', key: 'commons', title, url }
    }

    if (!isOfType(projectNames, project)) {
      throw new Error(`project is unknown: ${project}`)
    }

    // Known case: wikidata, mediawiki
    if (lang === 'www') {
      return { lang: 'en', project, key: project, title, url }
    }

    // Support multi-parts language codes, such as be_x_old
    const sitelang = lang.replace(/-/g, '_')
    const key = `${sitelang}${project}`.replace('wikipedia', 'wiki')
    return { lang, project, key, title, url }
  } else {
    if (isAKey(specialSites, site)) {
      const project = specialSites[site]
      return { lang: 'en', project, key: site }
    }

    if (!isOfType(sites, site)) {
      throw new Error(`site not found: ${site}. Updating wikibase-sdk to a more recent version might fix the issue.`)
    }

    let [ lang, projectSuffix, rest ] = site.split('wik')

    // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
    if (rest != null) throw new Error(`invalid sitelink key: ${site}`)

    // Support keys such as be_x_oldwiki, which refers to be-x-old.wikipedia.org
    lang = lang.replace(/_/g, '-')

    const project = projectsBySuffix[projectSuffix]
    if (!project) throw new Error(`sitelink project not found: ${project}`)

    return { lang, project, key: site }
  }
}

export const isSite = (site: string): site is Site => isOfType(sites, site)

/** @deprecated use isSite */
export const isSitelinkKey = isSite

const projectsBySuffix = {
  i: 'wikipedia',
  isource: 'wikisource',
  iquote: 'wikiquote',
  tionary: 'wiktionary',
  ibooks: 'wikibooks',
  iversity: 'wikiversity',
  ivoyage: 'wikivoyage',
  inews: 'wikinews',
} as const

const projectNames = [
  ...Object.values(projectsBySuffix),
  ...Object.values(specialSites),
] as const

export type Project = typeof projectNames[number]
