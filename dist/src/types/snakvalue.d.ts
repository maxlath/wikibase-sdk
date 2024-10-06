import type { EntityType, IdByEntityType } from './entity.js';
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
export interface GenericWikibaseEntityIdSnakDataValue<T extends EntityType> {
    type: 'wikibase-entityid';
    value: {
        id: IdByEntityType[T];
        'numeric-id'?: number;
        'entity-type': T;
    };
}
export type WikibaseFormSnakDataValue = GenericWikibaseEntityIdSnakDataValue<'form'>;
export type WikibaseItemSnakDataValue = GenericWikibaseEntityIdSnakDataValue<'item'>;
export type WikibaseLexemeSnakDataValue = GenericWikibaseEntityIdSnakDataValue<'lexeme'>;
export type WikibasePropertySnakDataValue = GenericWikibaseEntityIdSnakDataValue<'property'>;
export type WikibaseSenseSnakDataValue = GenericWikibaseEntityIdSnakDataValue<'sense'>;
export type EntitySchemaSnakDataValue = GenericWikibaseEntityIdSnakDataValue<'entity-schema'>;
export type WikibaseEntityIdSnakDataValue = WikibaseFormSnakDataValue | WikibaseItemSnakDataValue | WikibaseLexemeSnakDataValue | WikibasePropertySnakDataValue | WikibaseSenseSnakDataValue | EntitySchemaSnakDataValue;
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