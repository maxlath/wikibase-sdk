import { wikibaseTimeToDateObject as toDateObject } from './wikibase_time_to_date_object.js';
import type { Url } from '../types/options.js';
export declare const isNumericId: (id: string) => boolean;
export declare const isEntityId: (id: string) => boolean;
export declare const isEntitySchemaId: (id: string) => boolean;
export declare const isItemId: (id: string) => boolean;
export declare const isPropertyId: (id: string) => boolean;
export declare const isLexemeId: (id: string) => boolean;
export declare const isFormId: (id: string) => boolean;
export declare const isSenseId: (id: string) => boolean;
export declare const isGuid: (guid: string) => boolean;
export declare const isHash: (hash: string) => boolean;
export declare function isPropertyClaimsId(id: string): boolean;
export declare const isRevisionId: (id: string) => boolean;
export declare function isEntityPageTitle(title: string): boolean;
export declare function getNumericId(id: string): string;
export interface WikibaseTimeObject {
    time: string;
    precision: number;
}
export type TimeInputValue = string | WikibaseTimeObject;
export type TimeFunction = (wikibaseTime: TimeInputValue) => any;
export declare const wikibaseTimeToEpochTime: (value: TimeInputValue) => any;
export declare const wikibaseTimeToISOString: (value: TimeInputValue) => any;
export declare const wikibaseTimeToSimpleDay: (value: TimeInputValue) => any;
export declare const wikibaseTimeToDateObject: typeof toDateObject;
export declare function getImageUrl(filename: string, width?: number): Url;
export declare function getEntityIdFromGuid(guid: string): string;
