# Get JSON from a SPARQL query

To get JSON results from a SPARQL query you can [make a HTTP request to https://query.wikidata.org/sparql?query={SPARQL}&format=json](https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual#SPARQL_endpoint), which with `wikidata-sdk` can be done like this:
```js
import { WBK, simplifySparqlResults } from 'wikibase-sdk'
// Make sure you initialize wbk with a sparqlEndpoint
const wbk = WBK({
  instance: 'https://my-wikibase-instan.se',
  sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
})
const sparql = 'SELECT * WHERE { ?s ?p ?o } LIMIT 10'
const url = wbk.sparqlQuery(sparql)
const rawResults = await fetch(url, {
  headers: {
    // A custom user-agent is required for Wikimedia services, see https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy
    'user-agent': 'my-custom-user-agent'
  }
}).then(res => res.json())
const simplifiedResults = simplifySparqlResults(rawResults)
```
For more information on results simplification, see [`simplifySparqlResults`](simplify_sparql_results.md).

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
const url = wbk.sparqlQuery(sparql)
// => https://query.my-wikibase-instan.se/sparql?format=json&query=%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0A%0ASELECT%20%3Fwork%20%3Fdate%20WHERE%20%7B%0A%20%20%3Fwork%20wdt%3AP50%20wd%3AQ535%20.%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fwork%20wdt%3AP577%20%3Fdate%20.%0A%20%20%7D%0A%7D%0A

```
Querying this url should return a big collection of objects with `work` and `date` attributes corresponding to all Mr Q535's works, that you might want to [simplify](simplify_sparql_results.md) before working with it.

### Pre-baked queries
* [Get entities reverse claims](get_entities_reverse_claims.md)

### POST request
If the generated request URL gets too long, you can make a POST request instead
```js
const [ url, body ]  = wbk.sparqlQuery(sparql).split('?')
request({ method: 'POST', url, body })
```

## Alternative SPARQL engines
### QLever
* Engine: https://github.com/ad-freiburg/qlever/
* Wikidata SPARQL endpoint: https://qlever.dev/wikidata

```js
import { WBK } from 'wikibase-sdk'
const wbk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://qlever.dev/wikidata'
})
const sparql = 'SELECT * WHERE { ?s ?p ?o } LIMIT 10'

// The generated URL will be enriched with the prefixes that could be identified, if not prefixes are already set
const url = wbk.sparqlQuery(sparql)

// Then it's the same as with the default (BlazeGraph) engine:
const rawResults = await fetch(url).then(res => res.json())
const simplifiedResults = simplifySparqlResults(rawResults)
```
