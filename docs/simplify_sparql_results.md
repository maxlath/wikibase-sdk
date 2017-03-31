# Simplify sparql results

With [SPARQL queries](sparql_query.md), you get results that look like this:
```json
{
  "head" : {
    "vars" : [ "author", "authorLabel", "birth" ]
  },
  "results" : {
    "bindings" : [ {
      "author" : {
        "type" : "uri",
        "value" : "http://www.wikidata.org/entity/Q3731207"
      },
      "authorLabel" : {
        "xml:lang" : "en",
        "type" : "literal",
        "value" : "Ercole Patti"
      },
      "birth" : {
        "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
        "type" : "literal",
        "value" : "1903"
      }
    }
    ]
  }
}
```
`simplifySparqlResults` converts it to a way simpler:
```json
[
  {
    "author": {
      "value": "Q3731207",
      "label": "Ercole Patti"
    },
    "birth": "1903"
  }
]
```
That's still hairy, because we requested 3 variables, but this gets even simpler if there is only one variable!
Say instead of `"vars" : [ "author", "authorLabel", "birth" ]`, we only ask for `"vars" : [ "author" ]`, the output of `simplifySparqlResults` will be:
```json
["Q3731207"]
```
And then to make it even more simpler, we can... hum no, that's all we got.

Use it like so:
```js
const simplifiedResults = wdk.simplifySparqlResults(results)
```
or for a more complete example (using [promises](https://www.promisejs.org))
```js
// see the "SPARQL Query" section above
const url = wdk.sparqlQuery(SPARQL)
promiseRequest(url)
.then(wdk.simplifySparqlResults)
.then((simplifiedResults) => { // do awesome stuffs here })
```
