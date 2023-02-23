export type SparqlValueRaw = string | number | boolean
export type SparqlValueType = SparqlValueRaw | Record<string, SparqlValueRaw>

export interface SparqlValueObj {
  readonly type: 'uri' | 'bnode'
  readonly datatype?: string
  readonly value: string
}

export interface SparqlResults {
  head: {
    vars: string[]
  }
  results: {
    bindings: Record<string, SparqlValueObj>[]
  }
}

export type SimplifiedSparqlResultRecord = Record<string, SparqlValueType>[]
export type SimplifiedSparqlResultMinified = SparqlValueRaw[]

export type SimplifiedSparqlResults = SimplifiedSparqlResultRecord | SimplifiedSparqlResultMinified
