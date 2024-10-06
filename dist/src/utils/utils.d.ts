/** Example: keep only 'fr' in 'fr_FR' */
export declare function shortLang(language: string): string;
/**
 * a polymorphism helper:
 * accept either a string or an array and return an array
 */
export declare function forceArray<T extends string>(array: T | readonly T[] | undefined): T[];
/** simplistic implementation to filter-out arrays and null */
export declare function isPlainObject(obj: unknown): boolean;
export declare const fixedEncodeURIComponent: (str: string) => string;
export declare const replaceSpaceByUnderscores: (str: string) => string;
export declare function uniq<T>(array: readonly T[]): T[];
export declare function rejectObsoleteInterface(args: IArguments): void;
/**
 * Checks if the `element` is of one of the entries of `all`
 * @example const isSite: site is Site = isOfType(sites, site)
 */
export declare function isOfType<T extends string>(all: readonly T[], element: unknown): element is T;
/** key is a key on the object */
export declare function isAKey<T extends PropertyKey>(obj: Readonly<Partial<Record<T, unknown>>>, key: PropertyKey): key is T;
/** like Object.entries() but with typed keys */
export declare function typedEntries<K extends string, V>(input: Readonly<Partial<Record<K, V>>>): Array<[K, V]>;
/** like Object.keys() but with typed keys */
export declare function typedKeys<Obj>(obj: Obj): (keyof Obj)[];
//# sourceMappingURL=utils.d.ts.map