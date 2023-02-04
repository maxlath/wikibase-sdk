export declare const timeConverters: {
    iso: (value: import("./helpers.js").TimeInputValue) => any;
    epoch: (value: import("./helpers.js").TimeInputValue) => any;
    'simple-day': (value: import("./helpers.js").TimeInputValue) => any;
    none: (wikibaseTime: any) => any;
};
export declare const parsers: {
    commonsMedia: (datavalue: any) => any;
    'external-id': (datavalue: any) => any;
    'geo-shape': (datavalue: any) => any;
    'globe-coordinate': (datavalue: any, options: any) => any;
    math: (datavalue: any) => any;
    monolingualtext: (datavalue: any, options: any) => any;
    'musical-notation': (datavalue: any) => any;
    quantity: (datavalue: any, options: any) => any;
    string: (datavalue: any) => any;
    'tabular-data': (datavalue: any) => any;
    time: (datavalue: any, options: any) => any;
    url: (datavalue: any) => any;
    'wikibase-entityid': (datavalue: any, options: any) => any;
    'wikibase-form': (datavalue: any, options: any) => any;
    'wikibase-item': (datavalue: any, options: any) => any;
    'wikibase-lexeme': (datavalue: any, options: any) => any;
    'wikibase-property': (datavalue: any, options: any) => any;
    'wikibase-sense': (datavalue: any, options: any) => any;
};
export declare function parseClaim(datatype: any, datavalue: any, options: any, claimId: any): any;
