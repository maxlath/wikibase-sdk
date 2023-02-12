import { fixedEncodeURIComponent, isOfType, rejectObsoleteInterface, replaceSpaceByUnderscores } from '../utils/utils.js'
import { languages } from './sitelinks_languages.js'
import { specialSites } from './special_sites.js'
import type { EntityId } from '../types/entity.js'
import type { Url, WmLanguageCode } from '../types/options.js'
import type { Site } from '../types/sitelinks.js'

const wikidataBase = 'https://www.wikidata.org/wiki/'

export interface GetSitelinkUrlOptions {
  site: Site
  title: string
}

export function getSitelinkUrl ({ site, title }: GetSitelinkUrlOptions): Url {
  rejectObsoleteInterface(arguments)

  if (!site) throw new Error('missing a site')
  if (!title) throw new Error('missing a title')

  const shortSiteKey = site.replace(/wiki$/, '')
  const specialUrlBuilder = siteUrlBuilders[shortSiteKey] || siteUrlBuilders[site]
  if (specialUrlBuilder) return specialUrlBuilder(title)

  const { lang, project } = getSitelinkData(site)
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title))
  return `https://${lang}.${project}.org/wiki/${title}`
}

const wikimediaSite = (subdomain: string) => (title: string) => `https://${subdomain}.wikimedia.org/wiki/${title}`

const siteUrlBuilders = {
  commons: wikimediaSite('commons'),
  mediawiki: (title: string) => `https://www.mediawiki.org/wiki/${title}`,
  meta: wikimediaSite('meta'),
  species: wikimediaSite('species'),
  wikidata: (entityId: EntityId) => {
    const prefix = prefixByEntityLetter[entityId[0]]
    let title = prefix ? `${prefix}:${entityId}` : entityId
    // Required for forms and senses
    title = title.replace('-', '#')
    return `${wikidataBase}${title}`
  },
  wikimania: wikimediaSite('wikimania'),
} as const

const prefixByEntityLetter = {
  E: 'EntitySchema',
  L: 'Lexeme',
  P: 'Property',
} as const

const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/

export interface SitelinkData {
  lang: WmLanguageCode
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
    let key: string
    // Known case: wikidata, mediawiki
    if (lang === 'www') {
      lang = 'en'
      key = project
    } else if (lang === 'commons') {
      lang = 'en'
      project = key = 'commons'
    } else {
      // Support multi-parts language codes, such as be_x_old
      lang = lang.replace(/-/g, '_')
      key = `${lang}${project}`.replace('wikipedia', 'wiki')
    }
    // @ts-expect-error
    return { lang, project, key, title, url }
  } else {
    const key = site
    const specialProjectName = specialSites[key]
    if (specialProjectName) {
      return { lang: 'en', project: specialProjectName, key }
    }

    let [ lang, projectSuffix, rest ] = key.split('wik')

    // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
    if (rest != null) throw new Error(`invalid sitelink key: ${key}`)

    if (!isOfType(languages, lang)) {
      throw new Error(`sitelink lang not found: ${lang}. Updating wikibase-sdk to a more recent version might fix the issue.`)
    }

    // Support keys such as be_x_oldwiki, which refers to be-x-old.wikipedia.org
    lang = lang.replace(/_/g, '-')

    const project = projectsBySuffix[projectSuffix]
    if (!project) throw new Error(`sitelink project not found: ${project}`)

    // @ts-expect-error
    return { lang, project, key }
  }
}

export const isSitelinkKey = (site: string): boolean => {
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
  inews: 'wikinews',
} as const

const projectNames = [
  ...Object.values(projectsBySuffix),
  ...Object.values(specialSites),
] as const

export type Project = typeof projectNames[number]
