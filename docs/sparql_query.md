# Get JSON from a SPARQL query

To get JSON results from a SPARQL query you can [make a HTTP request to https://query.wikidata.org/sparql?query={SPARQL}&format=json](https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual#SPARQL_endpoint), which with `wikidata-sdk` can be done like this:
```js
const url = wdk.sparqlQuery(SPARQL)
// request the generated URL with your favorite HTTP request library
```
You can then simplify the response using [`wdk.simplifySparqlResults`](simplify_sparql_results.md).

### Example

Exemple taken from [inventaire SPARQL queries](https://github.com/inventaire/inventaire/tree/master/server/data/wikidata/queries) (here written using [ES6 template string](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) capabilities)
```js
const authorQid = 'Q535'
const sparql = `
SELECT ?work ?date WHERE {
  ?work wdt:P50 wd:${authorQid} .
  OPTIONAL {
    ?work wdt:P577 ?date .
  }
}
`
const url = wdk.sparqlQuery(sparql)
// => https://query.wikidata.org/sparql?format=json&query=%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0A%0ASELECT%20%3Fwork%20%3Fdate%20WHERE%20%7B%0A%20%20%3Fwork%20wdt%3AP50%20wd%3AQ535%20.%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fwork%20wdt%3AP577%20%3Fdate%20.%0A%20%20%7D%0A%7D%0A

```
Querying this url should return a big collection of objects with `work` and `date` attributes corresponding to all Mr Q535's works, that you might want to [simplify](simplify_sparql_results.md) before working with it.

### Pre-baked queries
* [Get entities reverse claims](get_entities_reverse_claims.md)
