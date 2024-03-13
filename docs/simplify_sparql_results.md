# Simplify SPARQL results

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [simplifySparqlResults](#simplifysparqlresults)
- [minimizeSimplifiedSparqlResults](#minimizesimplifiedsparqlresults)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## simplifySparqlResults

With [SPARQL queries](sparql_query.md) such as [this one](https://github.com/maxlath/wikidata-sdk/blob/main/assets/queries/simplify_sparql_results_doc_example.rq), you get results that look like this:
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
`simplifySparqlResults` converts it to a way simpler:
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
That's still hairy, because we requested many variables, but that can get even simpler if there is only one variable!
Say instead of `"vars" : [ "author", "authorLabel", "birth" ]`, we only ask for `"vars" : [ "author" ]`:
```js
import { simplifySparqlResults, minimizeSimplifiedSparqlResults } from 'wikibase-sdk'
simplifySparqlResults(results)
// => [ { "author": "Q3731207" } ]
minimizeSimplifiedSparqlResults(simplifySparqlResults(results))
// => [ "Q3731207" ]
```
And then to make it even more simpler, we can... hum no, that's all we got.

Use it like so:
```js
const simplifiedResults = simplifySparqlResults(results)
```
or for a more complete example:
```js
// see the "SPARQL Query" section above
const url = wbk.sparqlQuery(SPARQL)
const rawResults = await fetch(url).then(res => res.json())
const simplifiedResults = simplifySparqlResults(rawResults)
```

##  minimizeSimplifiedSparqlResults

When only one variable is requested, you can use `minimizeSimplifiedSparqlResults`: the results will consist of an array of this variable values, instead of an array of objects.
```js
simplifySparqlResults(results)
// => [ { item: "Q112983" }, { item: "Q185598" }, { item: "Q3879286" } ]
minimizeSimplifiedSparqlResults(simplifySparqlResults(results))
// => [ "Q112983", "Q185598", "Q3879286" ]
```
