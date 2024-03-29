import type { SparqlResults } from '../../src/index.js'

export const noDatatypeData: SparqlResults = {
  head: {
    vars: [ 'entity', 'entityLabel', 'year' ],
  },
  results: {
    bindings: [ {
      entity: {
        type: 'uri',
        value: 'http://www.wikidata.org/entity/Q5059124',
      },
      entityLabel: {
        'xml:lang': 'en',
        type: 'literal',
        value: 'FAKE NO DATATYPE CASE',
      },
      year: {
        type: 'literal',
        value: '1937',
      },
    } ],
  },
}
