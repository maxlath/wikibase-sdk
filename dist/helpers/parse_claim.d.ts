import type { TimeInputValue } from './helpers.js';
export declare const timeConverters: {
    readonly iso: (value: TimeInputValue) => string;
    readonly epoch: (value: TimeInputValue) => string | number;
    readonly 'simple-day': (value: TimeInputValue) => string;
    readonly none: (wikibaseTime: TimeInputValue) => string;
};
export declare const parsers: {
    readonly commonsMedia: (datavalue: any) => any;
    readonly 'external-id': (datavalue: any) => any;
    readonly 'geo-shape': (datavalue: any) => any;
    readonly 'globe-coordinate': (datavalue: any, options: any) => any;
    readonly math: (datavalue: any) => any;
    readonly monolingualtext: (datavalue: any, options: any) => any;
    readonly 'musical-notation': (datavalue: any) => any;
    readonly quantity: (datavalue: any, options: any) => any;
    readonly string: (datavalue: any) => any;
    readonly 'tabular-data': (datavalue: any) => any;
    readonly time: (datavalue: any, options: any) => any;
    readonly url: (datavalue: any) => any;
    readonly 'wikibase-entityid': (datavalue: any, options: any) => any;
    readonly 'wikibase-form': (datavalue: any, options: any) => any;
    readonly 'wikibase-item': (datavalue: any, options: any) => any;
    readonly 'wikibase-lexeme': (datavalue: any, options: any) => any;
    readonly 'wikibase-property': (datavalue: any, options: any) => any;
    readonly 'wikibase-sense': (datavalue: any, options: any) => any;
};
export declare function parseClaim(datatype: any, datavalue: any, options: any, claimId: any): any;
