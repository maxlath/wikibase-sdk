export type SparqlValueRaw = string | number | boolean
export type SparqlValueType = SparqlValueRaw | Record<string, SparqlValueRaw>

export interface SparqlResults {
  head: {
    vars: string[]
  }
  results: {
    bindings: unknown[]
  }
}

export type SimplifiedSparqlResults = Record<string, SparqlValueType>[] | SparqlValueRaw[]
