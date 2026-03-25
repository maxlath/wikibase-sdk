import type { SimplifyClaimsOptions } from './simplify_claims.js'

// Keep options names consistent with wikibase-edit options as far as reasonable
// https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#config
export interface InstanceConfig {
  instance?: string
  sparqlEndpoint?: string
  wgScriptPath?: string
}

export interface ClientOptions {
  userAgent?: string
}

export interface SimpleClientOptions {
  simplifyEntityOptions?: SimplifyEntityOptions
}

export type Config = InstanceConfig & ClientOptions & SimpleClientOptions

export type Props = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype'
export type UrlResultFormat = 'xml' | 'json'

export type LanguageCode = string

export interface SimplifyEntityOptions extends SimplifyClaimsOptions, SimplifySitelinkOptions {}

export interface SimplifySitelinkOptions {
  addUrl?: boolean
  keepBadges?: boolean
  keepAll?: boolean
}

/** @deprecated use LanguageCode or WikimediaLanguageCode */
export type WmLanguageCode = LanguageCode
