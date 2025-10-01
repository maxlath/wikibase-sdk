type ApiQueryValue = string | number | true;
export type ApiQueryParameters = Record<string, ApiQueryValue>;
export type Url = string;
export type BuildUrlFunction = <T extends string>(options: Readonly<Partial<Record<T, ApiQueryValue>>>) => Url;
export declare function buildUrlFactory(instanceApiEndpoint: Url): BuildUrlFunction;
export {};
//# sourceMappingURL=build_url.d.ts.map