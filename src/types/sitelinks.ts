import { specialSites } from '../helpers/special_sites.js'
import type { ItemId } from './entity.js'
import type { Url } from './options.js'
import type { sites } from '../helpers/sitelinks_sites.js'

const multilangSitesNames = Object.values(specialSites)

export type Site = typeof sites[number] | typeof multilangSitesNames[number]

export interface Sitelink {
  site: Site
  title: string
  badges: ItemId[]
  url?: Url
}

export type Sitelinks = Record<Site, Sitelink>

export type SimplifiedSitelinks = Record<Site, string>
