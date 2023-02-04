import type { WmLanguageCode } from '../types/options.js';
export declare function shortLang(language: string): WmLanguageCode;
export declare function forceArray(array: any): string[];
export declare const isPlainObject: (obj: any) => boolean;
export declare const fixedEncodeURIComponent: (str: string) => string;
export declare const replaceSpaceByUnderscores: (str: string) => string;
export declare const uniq: (array: string[]) => string[];
export declare function rejectObsoleteInterface(args: any): void;
