export interface WikibaseTimeObject {
    time: string;
    precision: number;
}
export type TimeInputValue = string | WikibaseTimeObject;
export declare function wikibaseTimeToDateObject(wikibaseTime: TimeInputValue): Date;
export declare const wikibaseTimeToEpochTime: (value: TimeInputValue) => string | number;
export declare const wikibaseTimeToISOString: (value: TimeInputValue) => string;
export declare const wikibaseTimeToSimpleDay: (value: TimeInputValue) => string;
//# sourceMappingURL=time.d.ts.map