import type { UrlResultFormat } from './options.js'

export type WbGetEntities = {
  action: 'wbgetentities',
  titles?: string,
  sites?: string,
  ids?: string,
  format: UrlResultFormat,
  normalize?: string,
  languages?: string,
  props?: string,
  redirects?: 'yes' | 'no', // Default: yes
};
