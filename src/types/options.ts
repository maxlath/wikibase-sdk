import type { SimplifySnaksOptions } from './simplify_claims.js'
import type { Language } from '../helpers/wikimedia_constants.js'

export interface InstanceConfig {
  instance?: string
  sparqlEndpoint?: string
  wgScriptPath?: string
}

export type Props = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype'
export type UrlResultFormat = 'xml' | 'json'

/** @deprecated use Language */
export type WmLanguageCode = Language

export type ApiQueryParameters = Record<string, string | number | true>

// export type Url = `http${string}`
export type Url = string

export interface SimplifyEntityOptions extends SimplifySnaksOptions, SimplifySitelinkOptions {}

export interface SimplifySitelinkOptions {
  addUrl?: boolean
  keepBadges?: boolean
  keepAll?: boolean
}
