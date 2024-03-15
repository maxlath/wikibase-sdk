export const multiVarsData = {
    head: {
        vars: ['entity', 'entityLabel', 'year'],
    },
    results: {
        bindings: [{
                entity: {
                    type: 'uri',
                    value: 'http://www.wikidata.org/entity/Q3731207',
                },
                entityLabel: {
                    'xml:lang': 'en',
                    type: 'literal',
                    value: 'Ercole Patti',
                },
                year: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'literal',
                    value: '1903',
                },
            }, {
                entity: {
                    type: 'bnode',
                    value: 't284055162',
                },
                entityLabel: {
                    'xml:lang': 'en',
                    type: 'literal',
                    value: 'FAKE BNODE',
                },
                year: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'literal',
                    value: '1970',
                },
            }, {
                entity: {
                    type: 'uri',
                    value: 'http://www.wikidata.org/entity/Q505932',
                },
                entityLabel: {
                    'xml:lang': 'en',
                    type: 'literal',
                    value: 'Paul Bailey',
                },
                year: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'literal',
                    value: '1937',
                },
            }],
    },
};
//# sourceMappingURL=multi_vars_sparql_results.js.map