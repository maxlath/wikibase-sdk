import type { Dictionary } from './helper.js'

export type SparqlValueRaw = string | number
export type SparqlValueType = SparqlValueRaw | Dictionary<SparqlValueRaw>

export interface SparqlResults {
  head: {
    vars: string[];
  };
  results: {
    bindings: unknown[];
  };
}

export type SimplifiedSparqlResults = Dictionary<SparqlValueType>[] | SparqlValueRaw[]
