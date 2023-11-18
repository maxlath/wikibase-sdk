import should from 'should';
import { sparqlQueryFactory } from '../src/queries/sparql_query.js';
import { sparqlEndpoint } from './lib/tests_env.js';
const sparqlQuery = sparqlQueryFactory(sparqlEndpoint);
const sparqlExample = `
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
`;
describe('sparqlQuery', () => {
    it('env', () => {
        should(sparqlQuery).be.a.Function();
    });
    it('should return a url', () => {
        const url = sparqlQuery(sparqlExample);
        should(url).be.a.String();
        should(url).match(/https:\/\//);
    });
});
//# sourceMappingURL=sparql_query.js.map