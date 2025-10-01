import type { Url } from '../../src/utils/build_url.js';
export declare function readJsonFile(jsonFilePath: string): any;
export declare function objLenght<K extends string | number | symbol>(obj: Partial<Readonly<Record<K, unknown>>>): number;
export declare function parseQuery(query: string | string[][] | Record<string, string> | URLSearchParams): Record<string, string>;
export declare function parseUrlQuery(url: Url): Record<string, string>;
export declare function assert(condition: boolean): asserts condition;
export declare function assertPlainObject(obj: any): void;
//# sourceMappingURL=utils.d.ts.map