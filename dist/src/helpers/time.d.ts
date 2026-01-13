export interface WikibaseTimeObject {
    time: string;
    precision: number;
}
export type TimeInputValue = string | WikibaseTimeObject;
export declare function wikibaseTimeToDateObject(wikibaseTime: TimeInputValue): Date;
export declare const wikibaseTimeToEpochTime: (wikibaseTime: TimeInputValue) => number;
export declare const wikibaseTimeToISOString: (value: TimeInputValue) => string;
export declare const wikibaseTimeToSimpleDay: (value: TimeInputValue) => string;
export type TimeConverter<T> = (wikibaseTime: TimeInputValue) => T;
//# sourceMappingURL=time.d.ts.map