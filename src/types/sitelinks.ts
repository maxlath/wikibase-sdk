import type { ItemId } from './entity.js'
import type { Url } from './options.js'
import type { sites } from '../helpers/sitelinks_sites.js'
import type { specialSites } from '../helpers/special_sites.js'

type ValueOf<T> = T[keyof T]
type SpecialSiteName = ValueOf<typeof specialSites>

export type Site = typeof sites[number] | SpecialSiteName

export interface Sitelink {
  site: Site
  title: string
  badges: ItemId[]
  url?: Url
}

export type Sitelinks = Partial<Record<Site, Sitelink>>

export type SimplifiedSitelinks = Partial<Record<Site, string>>
