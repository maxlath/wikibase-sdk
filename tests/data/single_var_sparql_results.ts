import type { SparqlResults } from '../../src/index.js'

export const singleVarData: SparqlResults = {
  head: {
    vars: [ 'genre' ],
  },
  results: {
    bindings: [ {
      genre: {
        type: 'uri',
        value: 'http://www.wikidata.org/entity/Q112983',
      },
    }, {
      genre: {
        type: 'uri',
        value: 'http://www.wikidata.org/entity/Q185598',
      },
    }, {
      genre: {
        type: 'uri',
        value: 'http://www.wikidata.org/entity/Q3879286',
      },
    }, {
      genre: {
        type: 'bnode',
        value: 't284055162',
      },
    }, {
      genre: {
        type: 'uri',
        value: 'http://www.wikidata.org/entity/Q1473346',
      },
    } ],
  },
}
