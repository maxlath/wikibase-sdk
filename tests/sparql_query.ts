import should from 'should'
import { sparqlQueryFactory } from '../src/queries/sparql_query.js'
import { sparqlEndpoint } from './lib/tests_env.js'

const sparqlQuery = sparqlQueryFactory(sparqlEndpoint)

const sparqlExample = `
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

describe('sparqlQuery', () => {
  it('env', () => {
    should(sparqlQuery).be.a.Function()
  })

  it('should return a url', () => {
    const url = sparqlQuery(sparqlExample)
    should(url).be.a.String()
    should(url).startWith(`${sparqlEndpoint}?format=json&query=SELECT`)
  })

  it('should detect qlevel endpoint', () => {
    const sparqlQueryAlt = sparqlQueryFactory('https://qlever.dev/wikidata')
    const url = sparqlQueryAlt(sparqlExample)
    // - Corrects endpoint URL
    // - Adds wellknown prefixes
    should(url).startWith('https://qlever.dev/api/wikidata?query=PREFIX')
  })
})
