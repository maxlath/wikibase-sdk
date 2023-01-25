import type { Dictionary } from './helper.js'
import type { languages } from '../helpers/sitelinks_languages.js'

export interface InstanceConfig {
  instance?: string;
  sparqlEndpoint?: string;
  wgScriptPath?: string;
}

export type Props = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype';
export type UrlResultFormat = 'xml' | 'json';
export type Language = typeof languages[number]

export type ApiQueryParameters = Dictionary<string | number>

// export type Url = `http${string}`
export type Url = string

export interface GetEntitiesFromSitelinksOptions {
  titles: string | string[];
  sites: string | string[];
  languages?: Language | Language[];
  props?: string | string[];
  format?: UrlResultFormat;
}

export interface GetEntitiesOptions {
  ids: string | string[];
  languages?: Language | Language[];
  props?: Props | Props[];
  format?: UrlResultFormat;
}

export interface GetReverseClaimOptions {
  limit?: number;
  keepProperties?: boolean;
  caseInsensitive?: boolean;
}

export interface GetRevisionsOptions {
  limit?: number;
  start?: string | number;
  end?: string | number;
}

export interface SimplifyEntitiesOptions extends SimplifySnaksOptions, SimplifySitelinkOptions {}

export interface SimplifySitelinkOptions {
  addUrl?: boolean;
}
