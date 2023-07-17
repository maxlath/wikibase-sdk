import type { EntityId, EntityType } from './entity.js'
import type { WmLanguageCode } from './options.js'

export type SnakValue =
  | GlobecoordinateSnakValue
  | MonolingualTextSnakValue
  | QuantitySnakValue
  | StringSnakValue
  | TimeSnakValue
  | WikibaseEntityIdSnakValue

/** @deprecated use TimeSnakValue */
export type ClaimSnakTimeValue = TimeSnakValue
/** @deprecated use QuantitySnakValue */
export type ClaimSnakQuantity = QuantitySnakValue
/** @deprecated use StringSnakValue */
export type ClaimSnakString = StringSnakValue
/** @deprecated use WikibaseEntityIdSnakValue */
export type SnakEntityValue = WikibaseEntityIdSnakValue
/** @deprecated use WikibaseEntityIdSnakValue */
export type ClaimSnakWikibaseItem = WikibaseEntityIdSnakValue

export interface GlobecoordinateSnakValue {
  type: 'globecoordinate';
  value: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    precision: number;
    globe: string;
  };
}

export interface MonolingualTextSnakValue {
  type: 'monolingualtext';
  value: {
    language: WmLanguageCode;
    text: string;
  };
}

export interface QuantitySnakValue {
  type: 'quantity';
  value: {
    amount: string;
    unit: string;
    upperBound?: string;
    lowerBound?: string;
  };
}

export interface StringSnakValue {
  type: 'string';
  value: string;
}

export interface TimeSnakValue {
  type: 'time';
  value: {
    time: string;
    timezone: number;
    before: number;
    after: number;
    precision: number;
    calendarmodel: string;
  };
}

export interface WikibaseEntityIdSnakValue {
  type: 'wikibase-entityid';
  value: {
    id: EntityId;
    'numeric-id'?: number;
    'entity-type': EntityType;
  };
}
