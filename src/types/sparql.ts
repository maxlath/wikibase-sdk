export type SparqlValueRaw = string | number | boolean
export type SparqlValueType = SparqlValueRaw | Record<string, SparqlValueRaw>

export interface SparqlValueObj {
  readonly type: 'uri' | 'bnode'
  readonly datatype?: string
  readonly value: string
}

export interface SparqlResults {
  readonly head: {
    readonly vars: readonly string[]
  }
  readonly results: {
    readonly bindings: ReadonlyArray<Record<string, SparqlValueObj>>
  }
}
