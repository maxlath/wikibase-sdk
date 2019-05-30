require('should')
const { sparqlEndpoint } = require('./lib/tests_env')
const wdSparqlQuery = require('../lib/queries/sparql_query')(sparqlEndpoint)

const sparqlExemple = `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  SELECT DISTINCT ?entity ?entityLabel (year(?date) as ?year)
  WHERE
  {
     ?entity wdt:P569 ?date .
     ?book wdt:P50 ?entity .
     ?book wdt:P31/wdt:P279* wd:Q571 .
     SERVICE wikibase:label {
       bd:serviceParam wikibase:language "en" .
     }
     FILTER (datatype(?date) = xsd:dateTime)
     FILTER (month(?date) = month(now()))
     FILTER (day(?date) = day(now()))
  }
`

describe('wdSparqlQuery', () => {
  it('env', done => {
    wdSparqlQuery.should.be.a.Function()
    done()
  })

  it('should return a url', done => {
    const url = wdSparqlQuery(sparqlExemple)
    url.should.be.a.String()
    url.should.match(new RegExp('https://'))
    done()
  })
})
