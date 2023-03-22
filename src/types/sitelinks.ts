import type { ItemId } from './entity.js'
import type { Url } from './options.js'
import type { Site } from '../helpers/wikimedia_constants.js'

export interface Sitelink {
  site: Site
  title: string
  badges: ItemId[]
  url?: Url
}

export type Sitelinks = Partial<Record<Site, Sitelink>>

export type SimplifiedSitelinks = Partial<Record<Site, string>>
