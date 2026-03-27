import type { UrlResultFormat } from './options.js'

export interface WbGetEntities {
  action: 'wbgetentities'
  titles?: string
  sites?: string
  ids?: string
  format: UrlResultFormat
  normalize?: true
  languages?: string
  props?: string
  redirects?: 'yes' | 'no' // Default: yes
  formatversion?: '1' | '2' // Undocumented attribute, see https://github.com/maxlath/wikibase-sdk/pull/136
}
