import type { Dictionary } from './helper.js'

export interface InstanceConfig {
  instance?: string;
  sparqlEndpoint?: string;
  wgScriptPath?: string;
}

export type Property = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype';
export type SearchType = 'item' | 'property' | 'lexeme' | 'form' | 'sense'
export type UrlResultFormat = 'xml' | 'json';

export type ApiQueryParameters = Dictionary<string | number>

// export type Url = `http${string}`
export type Url = string

export interface GetEntitiesFromSitelinksOptions {
  titles: string | string[];
  sites: string | string[];
  languages?: string | string[];
  props?: string | string[];
  format?: UrlResultFormat;
}

export interface GetEntitiesOptions {
  ids: string | string[];
  languages?: string | string[];
  props?: Property | Property[];
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

export interface SimplifyClaimsOptions {
  entityPrefix?: string;
  propertyPrefix?: string;
  keepRichValues?: boolean;
  keepTypes?: boolean;
  keepQualifiers?: boolean;
  keepReferences?: boolean;
  keepIds?: boolean;
  keepHashes?: boolean;
  keepNonTruthy?: boolean;
  timeConverter?: 'iso' | 'epoch' | 'simple-day' | 'none';
  novalueValue: any;
  somevalueValue: any;
}

export interface SimplifyEntitiesOptions extends SimplifyClaimsOptions, SimplifySitelinkOptions {}

export interface SimplifySitelinkOptions {
  addUrl?: boolean;
}
