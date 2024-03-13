import type { SparqlResults } from '../../src/index.js'

export const sparqlResultsWithNestedAssociatedVariables: SparqlResults = {
  head: {
    vars: [
      'item',
      'end',
      'endTime',
      'endTimePrecision',
    ],
  },
  results: {
    bindings: [
      {
        item: {
          type: 'uri',
          value: 'http://www.wikidata.org/entity/Q111338353',
        },
      },
      {
        item: {
          type: 'uri',
          value: 'http://www.wikidata.org/entity/Q111338362',
        },
      },
    ],
  },
}
