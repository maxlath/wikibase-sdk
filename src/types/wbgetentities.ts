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
  /** Default: yes */
  redirects?: 'yes' | 'no'
}
