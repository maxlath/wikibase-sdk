import type { WmLanguageCode } from '../types/options.js';
/** Example: keep only 'fr' in 'fr_FR' */
export declare function shortLang(language: string): WmLanguageCode;
/**
 * a polymorphism helper:
 * accept either a string or an array and return an array
 */
export declare function forceArray<T extends string>(array: T | readonly T[] | undefined): T[];
/** simplistic implementation to filter-out arrays */
export declare function isPlainObject(obj: unknown): boolean;
export declare const fixedEncodeURIComponent: (str: string) => string;
export declare const replaceSpaceByUnderscores: (str: string) => string;
export declare function uniq<T>(array: readonly T[]): T[];
export declare function rejectObsoleteInterface(args: IArguments): void;
/**
 * Checks if the `element` is of one of the entries of `all`
 * @example const isWmLanguageCode: lang is WmLanguageCode = isOfType(languages, lang)
 */
export declare function isOfType<T extends string>(all: readonly T[], element: unknown): element is T;
