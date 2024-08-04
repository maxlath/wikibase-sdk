import type { TimeInputValue } from './time.js';
import type { SimplifySnakOptions } from '../types/simplify_claims.js';
import type { CommonsMediaSnakDataValue, ExternalIdSnakDataValue, GeoShapeSnakDataValue, GlobeCoordinateSnakDataValue, MathSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue, MusicalNotationSnakDataValue, TabularDataSnakDataValue, UrlSnakDataValue, WikibaseFormSnakDataValue, WikibaseItemSnakDataValue, WikibaseLexemeSnakDataValue, WikibasePropertySnakDataValue, WikibaseSenseSnakDataValue, EntitySchemaSnakDataValue } from '../types/snakvalue.js';
declare function stringValue(datavalue: StringSnakDataValue): string;
declare function monolingualtext(datavalue: MonolingualTextSnakDataValue, options: {
    keepRichValues: false;
}): string;
declare function monolingualtext(datavalue: MonolingualTextSnakDataValue, options: {
    keepRichValues: true;
}): MonolingualTextSnakDataValue['value'];
declare function entity(datavalue: WikibaseEntityIdSnakDataValue, options: SimplifySnakOptions): string;
interface ParsedQuantitySnakValue {
    amount: number;
    unit: string;
    upperBound?: number;
    lowerBound?: number;
}
declare function quantity(datavalue: QuantitySnakDataValue, options: {
    keepRichValues: false;
}): number;
declare function quantity(datavalue: QuantitySnakDataValue, options: {
    keepRichValues: true;
}): ParsedQuantitySnakValue;
type LatLng = [number, number];
declare function coordinate(datavalue: GlobeCoordinateSnakDataValue, options: {
    keepRichValues: false;
}): LatLng;
declare function coordinate(datavalue: GlobeCoordinateSnakDataValue, options: {
    keepRichValues: true;
}): GlobeCoordinateSnakDataValue['value'];
type TimeStringSnakValue = TimeSnakDataValue['value'];
type TimeNumberSnakValue = Pick<TimeStringSnakValue, 'timezone' | 'before' | 'after' | 'precision' | 'calendarmodel'> & {
    time: number;
};
declare function time(datavalue: TimeSnakDataValue, options: {
    keepRichValues: false;
    timeConverter: 'iso' | 'simple-day' | 'none';
}): string;
declare function time(datavalue: TimeSnakDataValue, options: {
    keepRichValues: false;
    timeConverter: 'epoch';
}): number;
declare function time(datavalue: TimeSnakDataValue, options: {
    keepRichValues: true;
    timeConverter: 'iso' | 'simple-day' | 'none';
}): TimeStringSnakValue;
declare function time(datavalue: TimeSnakDataValue, options: {
    keepRichValues: true;
    timeConverter: 'epoch';
}): TimeNumberSnakValue;
export declare const timeConverters: {
    readonly iso: (value: TimeInputValue) => string;
    readonly epoch: (wikibaseTime: TimeInputValue) => number;
    readonly 'simple-day': (value: TimeInputValue) => string;
    readonly none: (wikibaseTime: TimeInputValue) => string;
};
type DataValueByDataType = {
    'commonsMedia': CommonsMediaSnakDataValue;
    'external-id': ExternalIdSnakDataValue;
    'entity-schema': EntitySchemaSnakDataValue;
    'geo-shape': GeoShapeSnakDataValue;
    'globe-coordinate': GlobeCoordinateSnakDataValue;
    'math': MathSnakDataValue;
    monolingualtext: MonolingualTextSnakDataValue;
    'musical-notation': MusicalNotationSnakDataValue;
    quantity: QuantitySnakDataValue;
    'string': StringSnakDataValue;
    'tabular-data': TabularDataSnakDataValue;
    'time': TimeSnakDataValue;
    'url': UrlSnakDataValue;
    'wikibase-form': WikibaseFormSnakDataValue;
    'wikibase-item': WikibaseItemSnakDataValue;
    'wikibase-lexeme': WikibaseLexemeSnakDataValue;
    'wikibase-property': WikibasePropertySnakDataValue;
    'wikibase-sense': WikibaseSenseSnakDataValue;
};
export declare const parsers: {
    readonly commonsMedia: typeof stringValue;
    readonly 'external-id': typeof stringValue;
    readonly 'entity-schema': typeof entity;
    readonly 'geo-shape': typeof stringValue;
    readonly 'globe-coordinate': typeof coordinate;
    readonly math: typeof stringValue;
    readonly monolingualtext: typeof monolingualtext;
    readonly 'musical-notation': typeof stringValue;
    readonly quantity: typeof quantity;
    readonly string: typeof stringValue;
    readonly 'tabular-data': typeof stringValue;
    readonly time: typeof time;
    readonly url: typeof stringValue;
    readonly 'wikibase-form': typeof entity;
    readonly 'wikibase-item': typeof entity;
    readonly 'wikibase-lexeme': typeof entity;
    readonly 'wikibase-property': typeof entity;
    readonly 'wikibase-sense': typeof entity;
};
export declare function parseSnak<T extends keyof DataValueByDataType>(datatype: T, datavalue: DataValueByDataType[T], options: SimplifySnakOptions): ReturnType<typeof parsers[T]>;
export {};
//# sourceMappingURL=parse_snak.d.ts.map