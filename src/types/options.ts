import type { SimplifySnaksOptions } from './simplify_claims.js'

export interface InstanceConfig {
  instance?: string
  sparqlEndpoint?: string
  wgScriptPath?: string
}

export type Props = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype'
export type UrlResultFormat = 'xml' | 'json'

export type ApiQueryParameters = Record<string, string | number | true>

// export type Url = `http${string}`
export type Url = string

export interface SimplifyEntityOptions extends SimplifySnaksOptions, SimplifySitelinkOptions {}

export interface SimplifySitelinkOptions {
  addUrl?: boolean
  keepBadges?: boolean
  keepAll?: boolean
}
