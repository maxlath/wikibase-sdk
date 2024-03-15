export type SparqlValueRaw = string | number | boolean;
export interface SparqlValueObj {
    readonly type: 'uri' | 'bnode' | 'literal';
    readonly value: string;
    readonly datatype?: string;
    readonly 'xml:lang'?: string;
}
export interface SparqlResults {
    readonly head: {
        readonly vars: readonly string[];
    };
    readonly results: {
        readonly bindings: ReadonlyArray<Record<string, SparqlValueObj>>;
    };
}
export type SimplifiedSparqlValueGroup = Record<string, SparqlValueRaw>;
export type SimplifiedSparqlValueObj = SparqlValueRaw | SimplifiedSparqlValueGroup;
export type SimplifiedSparqlResult = Record<string, SimplifiedSparqlValueObj>;
export type SimplifiedSparqlResults = SimplifiedSparqlResult[];
//# sourceMappingURL=sparql.d.ts.map