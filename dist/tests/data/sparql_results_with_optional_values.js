export const sparqlResultsWithOptionalValues = {
    head: {
        vars: ['label', 'wikiLink', 'originalTitle', 'composer', 'composerLabel', 'genre', 'genreLabel', 'publicationDate', 'duration', 'director', 'directorLabel', 'musicBrainzRGId', 'imdbId', 'countryOfOrigin', 'countryOfOriginLabel'],
    },
    results: {
        bindings: [{
                label: {
                    'xml:lang': 'fr',
                    type: 'literal',
                    value: 'Tarzan',
                },
                originalTitle: {
                    'xml:lang': 'en',
                    type: 'literal',
                    value: 'Tarzan',
                },
                composer: {
                    type: 'uri',
                    value: 'http://www.wikidata.org/entity/Q952428',
                },
                countryOfOrigin: {
                    type: 'uri',
                    value: 'http://www.wikidata.org/entity/Q183',
                },
                publicationDate: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
                    type: 'literal',
                    value: '2013-01-01T00:00:00Z',
                },
                duration: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#decimal',
                    type: 'literal',
                    value: '94',
                },
                director: {
                    type: 'uri',
                    value: 'http://www.wikidata.org/entity/Q13704719',
                },
                imdbId: {
                    type: 'literal',
                    value: 'tt1705952',
                },
                wikiLink: {
                    type: 'uri',
                    value: 'https://fr.wikipedia.org/wiki/Tarzan%20%28film%2C%202013%29',
                },
                composerLabel: {
                    'xml:lang': 'fr',
                    type: 'literal',
                    value: 'David Newman',
                },
                directorLabel: {
                    'xml:lang': 'fr',
                    type: 'literal',
                    value: 'Reinhard Klooss',
                },
                countryOfOriginLabel: {
                    'xml:lang': 'fr',
                    type: 'literal',
                    value: 'Allemagne',
                },
            }],
    },
};
//# sourceMappingURL=sparql_results_with_optional_values.js.map