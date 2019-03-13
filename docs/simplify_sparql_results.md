# Simplify sparql results

With [SPARQL queries](sparql_query.md) such as [this one](https://github.com/maxlath/wikidata-sdk/blob/master/assets/queries/simplify_sparql_results_doc_example.rq), you get results that look like this:
```json
{
  "head": {
    "vars": [
      "author",
      "authorLabel",
      "authorDescription",
      "authorAltLabel",
      "birth"
    ]
  },
  "results": {
    "bindings": [
      {
        "author": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q184226"
        },
        "birth": {
          "datatype": "http://www.w3.org/2001/XMLSchema#dateTime",
          "type": "literal",
          "value": "1925-01-18T00:00:00Z"
        },
        "authorLabel": {
          "xml:lang": "en",
          "type": "literal",
          "value": "Gilles Deleuze"
        },
        "authorDescription": {
          "xml:lang": "en",
          "type": "literal",
          "value": "French philosopher"
        },
        "authorAltLabel": {
          "xml:lang": "en",
          "type": "literal",
          "value": "Deleuze, G. Deleuze, Zhilʹ Delëz"
        }
      }
    ]
  }
}
```
`wdk.simplify.sparqlResults` converts it to a way simpler:
```json
[
  {
    "author": {
      "value": "Q184226",
      "label": "Gilles Deleuze",
      "description": "French philosopher",
      "aliases": "Deleuze, G. Deleuze, Zhilʹ Delëz"
    },
    "birth": "1925-01-18T00:00:00Z"
  }
]
```
That's still hairy, because we requested 3 variables, but that can get even simpler if there is only one variable!
Say instead of `"vars" : [ "author", "authorLabel", "birth" ]`, we only ask for `"vars" : [ "author" ]`:
```js
simplify.sparqlResults(results)
// => [ { "author": "Q3731207" } ]
simplify.sparqlResults(results, { minimize: true })
// => [ "Q3731207" ]
```
And then to make it even more simpler, we can... hum no, that's all we got.

Use it like so:
```js
const simplifiedResults = wdk.simplify.sparqlResults(results)
```
or for a more complete example (using [promises](https://www.promisejs.org))
```js
// see the "SPARQL Query" section above
const url = wdk.sparqlQuery(SPARQL)

// If you aren't familiar with Promise requests
// see https://github.com/maxlath/wikidata-sdk/issues/31
promiseRequest(url)
.then(wdk.simplify.sparqlResults)
.then(simplifiedResults => { // do awesome stuffs here })
```

## options

### minimize
> Default: `false`

When only one variable is requested, set minimize to `true`, the simplified results will consist of an array of this variable values, instead of an array of objects.
```js
wdk.simplify.sparqlResults(results, { minimize: true })
// => [ "Q112983", "Q185598", "Q3879286" ]

wdk.simplify.sparqlResults(results, { minimize: false })
// => [ { item: "Q112983" }, { item: "Q185598" }, { item: "Q3879286" } ]
```
