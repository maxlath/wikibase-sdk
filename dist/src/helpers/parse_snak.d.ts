import type { TimeInputValue } from './time.js';
import type { CustomSimplifiedSnakValueByDatavalueType, SimplifySnakOptions } from '../types/simplify_claims.js';
import type { CommonsMediaSnakDataValue, ExternalIdSnakDataValue, GeoShapeSnakDataValue, GlobeCoordinateSnakDataValue, MathSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue, MusicalNotationSnakDataValue, TabularDataSnakDataValue, UrlSnakDataValue, WikibaseFormSnakDataValue, WikibaseItemSnakDataValue, WikibaseLexemeSnakDataValue, WikibasePropertySnakDataValue, WikibaseSenseSnakDataValue, EntitySchemaSnakDataValue, MediaInfoSnakDataValue, SnakDataValueByDatavalueType, EdtfSnakDataValue, LocalMediaSnakDataValue } from '../types/snakvalue.js';
declare function parseStringValue(datavalue: StringSnakDataValue): string;
declare function parseMonolingualTextValue(datavalue: MonolingualTextSnakDataValue, options: {
    keepRichValues: false;
}): string;
declare function parseMonolingualTextValue(datavalue: MonolingualTextSnakDataValue, options: {
    keepRichValues: true;
}): MonolingualTextSnakDataValue['value'];
declare function parseEntityValue(datavalue: WikibaseEntityIdSnakDataValue, options: SimplifySnakOptions): string;
interface ParsedQuantitySnakValue {
    amount: number;
    unit: string;
    upperBound?: number;
    lowerBound?: number;
}
declare function parseQuantityValue(datavalue: QuantitySnakDataValue, options: {
    keepRichValues: false;
}): number;
declare function parseQuantityValue(datavalue: QuantitySnakDataValue, options: {
    keepRichValues: true;
}): ParsedQuantitySnakValue;
type LatLng = [number, number];
declare function parseGlobeCoordinateValue(datavalue: GlobeCoordinateSnakDataValue, options: {
    keepRichValues: false;
}): LatLng;
declare function parseGlobeCoordinateValue(datavalue: GlobeCoordinateSnakDataValue, options: {
    keepRichValues: true;
}): GlobeCoordinateSnakDataValue['value'];
type TimeStringSnakValue = TimeSnakDataValue['value'];
type TimeNumberSnakValue = Pick<TimeStringSnakValue, 'timezone' | 'before' | 'after' | 'precision' | 'calendarmodel'> & {
    time: number;
};
declare function parseTimeValue(datavalue: TimeSnakDataValue, options: {
    keepRichValues: false;
    timeConverter: 'iso' | 'simple-day' | 'none';
}): string;
declare function parseTimeValue(datavalue: TimeSnakDataValue, options: {
    keepRichValues: false;
    timeConverter: 'epoch';
}): number;
declare function parseTimeValue(datavalue: TimeSnakDataValue, options: {
    keepRichValues: true;
    timeConverter: 'iso' | 'simple-day' | 'none';
}): TimeStringSnakValue;
declare function parseTimeValue(datavalue: TimeSnakDataValue, options: {
    keepRichValues: true;
    timeConverter: 'epoch';
}): TimeNumberSnakValue;
export declare const timeConverters: {
    readonly iso: (value: TimeInputValue) => string;
    readonly epoch: (wikibaseTime: TimeInputValue) => number;
    readonly 'simple-day': (value: TimeInputValue) => string;
    readonly none: (wikibaseTime: TimeInputValue) => string;
};
interface DataValueBySnakDatatype {
    commonsMedia: CommonsMediaSnakDataValue;
    edtf: EdtfSnakDataValue;
    'entity-schema': EntitySchemaSnakDataValue;
    'external-id': ExternalIdSnakDataValue;
    'geo-shape': GeoShapeSnakDataValue;
    'globe-coordinate': GlobeCoordinateSnakDataValue;
    localMedia: LocalMediaSnakDataValue;
    math: MathSnakDataValue;
    mediainfo: MediaInfoSnakDataValue;
    monolingualtext: MonolingualTextSnakDataValue;
    'musical-notation': MusicalNotationSnakDataValue;
    quantity: QuantitySnakDataValue;
    string: StringSnakDataValue;
    'tabular-data': TabularDataSnakDataValue;
    time: TimeSnakDataValue;
    url: UrlSnakDataValue;
    'wikibase-form': WikibaseFormSnakDataValue;
    'wikibase-item': WikibaseItemSnakDataValue;
    'wikibase-lexeme': WikibaseLexemeSnakDataValue;
    'wikibase-property': WikibasePropertySnakDataValue;
    'wikibase-sense': WikibaseSenseSnakDataValue;
}
export type Datatype = keyof DataValueBySnakDatatype;
/** @deprecated use Datatype */
export type DataType = Datatype;
export interface DataValueByDatavalueType {
    globecoordinate: GlobeCoordinateSnakDataValue;
    monolingualtext: MonolingualTextSnakDataValue;
    quantity: QuantitySnakDataValue;
    string: StringSnakDataValue;
    time: TimeSnakDataValue;
    'wikibase-entityid': WikibaseEntityIdSnakDataValue;
}
export declare const parsersByDatavalueTypes: {
    readonly globecoordinate: typeof parseGlobeCoordinateValue;
    readonly monolingualtext: typeof parseMonolingualTextValue;
    readonly quantity: typeof parseQuantityValue;
    readonly string: typeof parseStringValue;
    readonly time: typeof parseTimeValue;
    readonly 'wikibase-entityid': typeof parseEntityValue;
};
export type DatavalueType = keyof typeof parsersByDatavalueTypes;
export declare const datavalueTypeBySnakDatatype: {
    readonly commonsMedia: "string";
    readonly edtf: "string";
    readonly 'external-id': "string";
    readonly 'entity-schema': "wikibase-entityid";
    readonly 'geo-shape': "string";
    readonly 'globe-coordinate': "globecoordinate";
    readonly localMedia: "string";
    readonly math: "string";
    readonly mediainfo: "wikibase-entityid";
    readonly monolingualtext: "monolingualtext";
    readonly 'musical-notation': "string";
    readonly quantity: "quantity";
    readonly string: "string";
    readonly 'tabular-data': "string";
    readonly time: "time";
    readonly url: "string";
    readonly 'wikibase-form': "wikibase-entityid";
    readonly 'wikibase-item': "wikibase-entityid";
    readonly 'wikibase-lexeme': "wikibase-entityid";
    readonly 'wikibase-property': "wikibase-entityid";
    readonly 'wikibase-sense': "wikibase-entityid";
};
export declare function parseSnakDatavalue<T extends DatavalueType>(datavalue: SnakDataValueByDatavalueType[T], options: SimplifySnakOptions): CustomSimplifiedSnakValueByDatavalueType[T];
export declare const datatypes: ("string" | "monolingualtext" | "quantity" | "time" | "commonsMedia" | "edtf" | "entity-schema" | "external-id" | "geo-shape" | "globe-coordinate" | "localMedia" | "math" | "mediainfo" | "musical-notation" | "tabular-data" | "url" | "wikibase-form" | "wikibase-item" | "wikibase-lexeme" | "wikibase-property" | "wikibase-sense")[];
export {};
//# sourceMappingURL=parse_snak.d.ts.map