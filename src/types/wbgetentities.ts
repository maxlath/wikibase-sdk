import type { UrlResultFormat } from './options.js'

// TODO: not sure why this fails as an interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type WbGetEntities = {
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
