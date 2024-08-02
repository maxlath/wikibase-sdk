import type { EntityId, EntityType } from './entity.js';
import type { LanguageCode } from './options.js';
export interface GlobeCoordinateSnakDataValue {
    type: 'globecoordinate';
    value: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        precision: number;
        globe: string;
    };
}
export interface MonolingualTextSnakDataValue {
    type: 'monolingualtext';
    value: {
        language: LanguageCode;
        text: string;
    };
}
export interface QuantitySnakDataValue {
    type: 'quantity';
    value: {
        amount: string;
        unit: string;
        upperBound?: string;
        lowerBound?: string;
    };
}
export interface StringSnakDataValue {
    type: 'string';
    value: string;
}
export type CommonsMediaSnakDataValue = StringSnakDataValue;
export type ExternalIdSnakDataValue = StringSnakDataValue;
export type GeoShapeSnakDataValue = StringSnakDataValue;
export type MathSnakDataValue = StringSnakDataValue;
export type MusicalNotationSnakDataValue = StringSnakDataValue;
export type TabularDataSnakDataValue = StringSnakDataValue;
export type UrlSnakDataValue = StringSnakDataValue;
export interface TimeSnakDataValue {
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
export interface WikibaseEntityIdSnakDataValue {
    type: 'wikibase-entityid';
    value: {
        id: EntityId;
        'numeric-id'?: number;
        'entity-type': EntityType;
    };
}
export type WikibaseFormSnakDataValue = WikibaseEntityIdSnakDataValue;
export type WikibaseItemSnakDataValue = WikibaseEntityIdSnakDataValue;
export type WikibaseLexemeSnakDataValue = WikibaseEntityIdSnakDataValue;
export type WikibasePropertySnakDataValue = WikibaseEntityIdSnakDataValue;
export type WikibaseSenseSnakDataValue = WikibaseEntityIdSnakDataValue;
export type SnakDataValue = GlobeCoordinateSnakDataValue | MonolingualTextSnakDataValue | QuantitySnakDataValue | StringSnakDataValue | TimeSnakDataValue | WikibaseEntityIdSnakDataValue;
/** @deprecated use SnakDataValue */
export type SnakValue = SnakDataValue;
/** @deprecated use TimeSnakDataValue */
export type ClaimSnakTimeValue = TimeSnakDataValue;
/** @deprecated use QuantitySnakDataValue */
export type ClaimSnakQuantity = QuantitySnakDataValue;
/** @deprecated use StringSnakDataValue */
export type ClaimSnakString = StringSnakDataValue;
/** @deprecated use WikibaseEntityIdSnakDataValue */
export type SnakEntityValue = WikibaseEntityIdSnakDataValue;
/** @deprecated use WikibaseEntityIdSnakDataValue */
export type ClaimSnakWikibaseItem = WikibaseEntityIdSnakDataValue;
/** @deprecated use GlobeCoordinateSnakDataValue */
export type GlobecoordinateSnakValue = GlobeCoordinateSnakDataValue;
/** @deprecated use MonolingualTextSnakDataValue */
export type MonolingualTextSnakValue = MonolingualTextSnakDataValue;
/** @deprecated use QuantitySnakDataValue */
export type QuantitySnakValue = QuantitySnakDataValue;
/** @deprecated use StringSnakDataValue */
export type StringSnakValue = StringSnakDataValue;
/** @deprecated use TimeSnakDataValue */
export type TimeSnakValue = TimeSnakDataValue;
/** @deprecated use WikibaseEntityIdSnakDataValue */
export type WikibaseEntityIdSnakValue = WikibaseEntityIdSnakDataValue;
//# sourceMappingURL=snakvalue.d.ts.map