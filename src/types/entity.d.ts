import type { Claim } from './claim.js'
import type { Dictionary, TypedKeyDictionnary } from './helper.js'
import type { SimplifiedClaims } from './simplify_claims.js'
import type { sites } from '../helpers/sitelinks_sites.js'

export type EntityType = 'item' | 'property' | 'lexeme' | 'form' | 'sense'

export interface LanguageEntry {
  language: string;
  value: string;
}

export interface Entity {
  type: string;
  datatype?: string;
  id: string;

  // Info
  pageid?: number;
  ns?: number;
  title?: string;
  lastrevid?: number;
  modified?: string;
  redirects?: {from: string, to: string};

  // Available when asked for in GetEntitiesOptions
  aliases?: Dictionary<LanguageEntry[]>;
  claims?: Dictionary<Claim[]>;
  descriptions?: Dictionary<LanguageEntry>;
  labels?: Dictionary<LanguageEntry>;
  sitelinks?: TypedKeyDictionnary<Site, Sitelink>;
}

export interface SimplifiedEntity {
  type: string;
  id: string;

  // Info
  modified?: string;

  aliases?: Dictionary<string[]>;
  claims?: SimplifiedClaims;
  descriptions?: Dictionary<string>;
  labels?: Dictionary<string>;
  sitelinks?: TypedKeyDictionnary<Site, string>;
}

export type Site = typeof sites[number]

export interface Sitelink {
  site: string;
  title: string;
  badges: string[];
  url?: string;
}
