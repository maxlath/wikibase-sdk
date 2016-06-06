![wikidata](https://pbs.twimg.com/profile_images/2498571390/cizdiwz4oiiq1zae94jp.png)

A javascript tool-suite to query [wikidata](http://wikidata.org/) and handle its results.

This library had for primary purpose to serve the needs of the [inventaire](https://github.com/inventaire/inventaire) project but extending its capabilities to other needs it totally possible: feel welcome to post your suggestions as issues or pull requests!

used APIs:
- [Wikidata API](https://www.wikidata.org/w/api.php)
- [Wikidata Query](http://query.wikidata.org/) (SPARQL)
- [WMLabs WDQ](http://wdq.wmflabs.org/api_documentation.html)

# Summary
- [Installation](#installation)
  - [via NPM](#via-npm)
  - [via Bower](#via-bower)
  - [The Old Way](#the-old-way)
- [How-to](#how-to)
  - [Build queries urls to:](#build-queries-urls-to)
    - [search in wikidata entities](#search-in-wikidata-entities)
    - [get entities by id](#get-entities-by-id)
    - [get many entities by id](#get-many-entities-by-id)
    - [get entities from Wikipedia titles](#get-entities-by-wikipedia-titles)
    - [get entities from any Wikimedia project titles](#get-entities-by-other-wikimedia-projects-titles)
    - [get entities reverse claims](#get-entities-reverse-claims)
    - [sparql queries](#sparql-queries)
  - [Results parsers](#results-parsers)
    - [Wikidata API queries](#wikidata-api-queries)
      - [simplify claims results](#simplify-claims-results)
        - [simplifyClaims](#simplifyclaims)
        - [simplifyPropertyClaims](#simplifypropertyclaims)
        - [simplifyClaim](#simplifyclaim)
    - [Wikidata Query (SPARQL) results](#wikidata-query-sparql-results)
      - [simplify sparql results](#simplify-sparql-results)
    - [WDQ queries](#wdq-queries)
  - [Other utils](#other-utils)
  - [A little CoffeeScript / Promises workflow demo](#a-little-coffeescript--promises-workflow-demo)
- [Command Line Interface](#cli)
  - [qlabel](#qlabel)
  - [wikiqid](#wikiqid)
- [License](#license)


# Installation

## via NPM
  in a terminal at your project root:

  ```bash
  npm install wikidata-sdk --save
  ```

  then in your javascript project:
  ```javascript
  var wdk = require('wikidata-sdk')
  ```

## via Bower
  in a terminal at your project root:
  ```bash
  bower install wikidata-sdk --save
  ```

  then, in your project, include either
  ```
  /bower_components/wikidata-sdk/dist/wikidata-sdk.js
  ```
  or
  ```
  /bower_components/wikidata-sdk/dist/wikidata-sdk.min.js
  ```

  this will create a global object named `wdk` (in a browser, accessible at `window.wdk`)


## The Old Way

  Just download the raw package from this repository or, even more lazy, include a `<script src="https://raw.githubusercontent.com/maxlath/wikidata-sdk/master/dist/wikidata-sdk.min.js"></script>` in your html to get wdk from github.

  In either case, this will create a global object named `wdk` (in a browser, accessible at `window.wdk`)

# How-to

## Build queries urls to

### search in wikidata entities
*associated Wikidata doc: [wbsearchentities](https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities)*

```javascript
var url = wdk.searchEntities('Ingmar Bergman')
```

this returns a query url that you are then free to request with the tool you like
```
https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Ingmar%20Bergman&language=en&limit=20&format=json
```

or with more parameters:
```javascript
var search = 'Ingmar Bergman'
var language = 'fr' // will default to 'en'
var limit = 10 // defaults to 20
var format = 'json' // defaults to json

var url = wdk.searchEntities(search, language, limit, format)
```
which can also be passed as an object:
```javascript
var url = wdk.searchEntities({
  search: 'Ingmar Bergman',
  format: 'xml',
  language: 'sv'
})
```

By default, the `uselang` parameter (the language in which the search results are returned) is set to the same as the language passed, but if for some weird use case you need to set a different language, you can still pass a 2 letters language code:
* as last argument (inline interface)
```javascript
var uselang = 'eo'
var url = wdk.searchEntities(search, language, limit, format, uselang)
```
* or set `uselang` in the option object (object interface).
```javascript
var url = wdk.searchEntities({
  search: 'Ingmar Bergman',
  language: 'sv',
  uselang: 'eo'
})
```
If the values aren't available in the desired language, it will fallback to the English value if available.

### get entities by id
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

on the same pattern

```javascript
var ids = 'Q571' // could also be several ids as an array: ['Q1', 'Q5', 'Q571']
var languages = ['en', 'fr', 'de'] // returns all languages if not specified
var properties = ['info', 'claims'] // returns all data if not specified
var format = 'xml' // defaults to json
var url = wdk.getEntities(ids, languages, properties, format)
```

properties being wikidata entities' properties: info, sitelinks, labels, descriptions, claims.

ids, languages, properties can get either one single value as a string or several values in a array


And Again, this can also be passed as an object:
```javascript
var url = wdk.getEntities({
  ids: ['Q1', 'Q5', 'Q571'],
  languages: ['en', 'fr', 'de'], // returns all languages if not specified
  properties: ['info', 'claims'], // returns all data if not specified
  format: 'xml' // defaults to json
})
```

### get many entities by id
Above 50 ids, `wdk.getEntities` will warn you that your request won't be fully fullfiled by Wikidata API due to its limitations policy.
You can use `wdk.getManyEntities` instead to generate several request urls to work around this limitation:

The arguments API is the same as getEntities:
```javascript
var urls = wdk.getEntities(['Q1', 'Q2', 'Q3', ..., 'Q123'])
// or
var urls = wdk.getEntities(['Q1', 'Q2', 'Q3', ..., 'Q123'], ['en', 'fr', 'de'], ['info', 'claims'], 'json')
// or
var urls = wdk.getEntities({
  ids: ['Q1', 'Q2', 'Q3', ..., 'Q123'],
  languages: ['en', 'fr', 'de'],
  properties: ['info', 'claims'],
  format: 'json'
})
```
but it returns an array of urls instead.

:warning: This limitation policy was probably there for a reason, right? This should be the exception, make sure to set an interval between your requests (500ms, 1s?), and if you really need a lot of entities, consider using [dumps](https://www.wikidata.org/wiki/Wikidata:Database_download#JSON_dumps_.28recommended.29): there are [great tools](https://github.com/maxlath/wikidata-filter) to work with those too! ;)

### get entities by Wikipedia titles
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

This can be very useful when you work with a list of Wikipedia articles in a given language and would like to move to Wikidata for all the awesomeness it provides:
```javascript
var url = wdk.getWikidataIdsFromWikipediaTitles('Hamburg')
//=> 'https://www.wikidata.org/w/api.php?action=wbgetentities&titles=Hamburg&sites=enwiki&format=json'

var url = wdk.getWikidataIdsFromWikipediaTitles(['Hamburg', 'Lyon', 'Berlin'])
// => 'https://www.wikidata.org/w/api.php?action=wbgetentities&titles=Hamburg%7CLyon%7CBerlin&sites=enwiki&format=json'
```

By default, it looks in the English Wikipedia, but we can change that:
```javascript
var titles = 'Hamburg'
var sites = 'dewiki' // or you can just pass the 2-letters language codes: 'de'
var languages = ['en', 'fr', 'de'] // those are the languages in which we would like the entities data
var properties = ['info', 'claims']
var format = 'json'
var url = wdk.getWikidataIdsFromWikipediaTitles(titles, sites, languages, properties, format)
```
or using the object interface:
```javascript
var url = wdk.getWikidataIdsFromWikipediaTitles({
  titles: 'Hamburg',
  sites: 'dewiki',
  languages: ['en', 'fr', 'de'],
  properties: ['info', 'claims'],
  format: 'json'
})
```

### get entities by other Wikimedia projects titles
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

This is exactly the same interface as with `getWikidataIdsFromWikipediaTitles`, you just need to specify the sitelink in the form `{2 letters language code}{project}`

```javascript
var url = wdk.getWikidataIdsFromSitelinks('Victor Hugo', 'frwikisource')
```

Actually, `getWikidataIdsFromWikipediaTitles` is just an alias of `getWikidataIdsFromSitelinks`, so you can use it for Wikipedia too:
```javascript
var url = wdk.getWikidataIdsFromSitelinks('Victor Hugo', 'frwiki')
// or given it defauts to the Wikipedia project:
var url = wdk.getWikidataIdsFromSitelinks('Victor Hugo', 'fr')
```

### get entities reverse claims

> **/!\ WDQ will be deprecated, use the [SPARQL endpoint](#sparql-queries) instead**

In wikidata API answers, you can only access claims on the entity's page, not claims pointing to this entity (what would be in the "what links here" page).

Fortunatly, you can query wikimedia awesome WDQ tool \o/
(And now also an even more awesome [SPARQL endpoint](#sparql-queries))

For instance, let's say you want to find all the entities that have Leo Tolstoy ([Q7243](http://www.wikidata.org/entity/Q7243)) for author ([P50](http://www.wikidata.org/entity/P50))

```javascript
var url = wdk.getReverseClaims('P50', 'Q7243')
```

and you can then query the obtained entities ids

```javascript
request(url, function(err, response){
  if (err) { dealWithError(err) }
  var entities = wdk.parse.wdq.entities(response)
  var url2 = wdk.getEntities(entities)
  request(url2 ....
})
```

it also work for string values: e.g. let's say you want to find which book as 978-0-465-06710-7 for ISBN-13 ([P212](http://www.wikidata.org/entity/P212)):

```javascript
var url = wdk.getReverseClaims('P212', '978-0-465-06710-7')
```

### sparql queries

But now, there is even more powerful than WDQ: the all mighty [Wikidata SPARQL endpoint](http://query.wikidata.org/)!

[SPARQL](https://en.wikipedia.org/wiki/Sparql) can be a weird thing at first, but the Wikidata team and community really puts lots of efforts to make things easy with a [user manual](https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual), [an awesome tool to test you queries with autocomplete](https://query.wikidata.org/) and [lots of examples](https://www.mediawiki.org/wiki/Wikibase/Indexing/SPARQL_Query_Examples)!

Then, to get JSON results you can [make a HTTP query to  https://query.wikidata.org/sparql?query={SPARQL}&format=json](https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual#SPARQL_endpoint), which with Wdk can be done like this:
```javascript
var url = wdk.sparqlQuery(SPARQL)
```

Exemple taken from [inventaire SPARQL queries](https://github.com/inventaire/inventaire/tree/master/server/data/wikidata/queries) (here written using [ES6 template string](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) capabilities)
```javascript
var authorQid = 'Q535'
var sparql = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

SELECT ?work ?date WHERE {
  ?work wdt:P50 wd:${authorQid} .
  OPTIONAL {
    ?work wdt:P577 ?date .
  }
}
`
var url = wdk.sparqlQuery(sparql)
// => https://query.wikidata.org/sparql?format=json&query=%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0A%0ASELECT%20%3Fwork%20%3Fdate%20WHERE%20%7B%0A%20%20%3Fwork%20wdt%3AP50%20wd%3AQ535%20.%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fwork%20wdt%3AP577%20%3Fdate%20.%0A%20%20%7D%0A%7D%0A

```
Querying this url should return a big collection of objects with `work` and `date` attributes corresponding to all Mr Q535's works

## Results parsers

### Wikidata API queries
you can pass the results from `wdk.searchEntities`, `wdk.getEntities`, `wdk.getWikidataIdsFromWikipediaTitles`, or `wdk.getWikidataIdsFromSitelinks` to `wdk.parse.wd.entities`, it will return entities with simplified claims (cf "simplify claims results" hereafter)

#### Simplify claims results
*associated Wikidata doc: [DataModel](https://www.mediawiki.org/wiki/Wikibase/DataModel)*

For each entities claims, Wikidata's API returns a deep object that requires some parsing that could be avoided for simple uses.

So instead of:
```json
"P279": [
  {
    "rank": "normal",
    "type": "statement",
    "mainsnak": {
      "datavalue": {
        "type": "wikibase-entityid",
        "value": {
          "numeric-id": 340169,
          "entity-type": "item"
        }
      },
      "datatype": "wikibase-item",
      "property": "P279",
      "snaktype": "value"
    },
    "id": "Q571$0115863d-4f02-0337-38c2-5e2bb7a0f628"
  },
  {
    "rank": "normal",
    "type": "statement",
    "mainsnak": {
      "datavalue": {
        "type": "wikibase-entityid",
        "value": {
          "numeric-id": 2342494,
          "entity-type": "item"
        }
      },
      "datatype": "wikibase-item",
      "property": "P279",
      "snaktype": "value"
    },
    "id": "Q571$04c87c4e-4bce-a9ab-eb75-d9a3ed695077"
  },
  {
    "rank": "normal",
    "type": "statement",
    "mainsnak": {
      "datavalue": {
        "type": "wikibase-entityid",
        "value": {
          "numeric-id": 386724,
          "entity-type": "item"
        }
      },
      "datatype": "wikibase-item",
      "property": "P279",
      "snaktype": "value"
    },
    "id": "Q571$afe3b5c3-424e-eb7b-60e6-c2ce0d122823"
  }
]
```

we could have

```json
"P279": [ "Q340169", "Q2342494", "Q386724" ]
```

That's what `simplifyClaims`, `simplifyPropertyClaims`, `simplifyClaim` do, each at their own level:

##### simplifyClaims
you just need to pass your entity' claims object to simplifyClaims as such:
```javascript
var simplifiedClaims = wdk.simplifyClaims(entity.claims)
```

in your workflow, that could give something like:

```javascript
var url = wdk.getEntities('Q535')
request(url, function(err, response){
  if (err) { dealWithError(err) }
  var entity = response.entities.Q535
  simplifiedClaims = wdk.simplifyClaims(entity.claims)
})
```

To keep things simple, "weird" values are removed (for instance, statements of datatype `wikibase-item` but set to `somevalues` instead of the expected Q id)

##### simplifyPropertyClaims
Same as simplifyClaims but expects an array of claims, typically the array of claims of a specific property:
```javascript
var simplifiedP31Claims = wdk.simplifyPropertyClaims(entity.claims.P31)
```

##### simplifyClaim
Same as simplifyClaims but expects a unique claim
```javascript
var simplifiedP31Claim = wdk.simplifyClaim(entity.claims.P31[0])
```

### Wikidata Query (SPARQL) results
#### simplify sparql results
With [SPARQL queries](#sparql-queries), you get results that look like this:
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
That's style hairy, because we requested 3 variables, but this gets even simpler if there is only one variable!
Say instead of `"vars" : [ "author", "authorLabel", "birth" ]`, we only ask for `"vars" : [ "author" ]`, the output of `simplifySparqlResults` will be:
```json
["Q3731207"]
```
And then to make it even more simpler, we can... hum no, that's all we got.

Use it like so:
```javascript
var simplifiedResults = wdk.simplifySparqlResults(results)
```
or for a more complete example (using [promises](https://www.promisejs.org))
```javascript
// see the "SPARQL Query" section above
var url = wdk.sparqlQuery(SPARQL)
promiseRequest(url)
.then(wdk.simplifySparqlResults)
.then((simplifiedResults) => { // do awesome stuffs here })
```

### WDQ queries
you can pass the results from `wdk.getReverseClaims` to `wdk.parse.wdq.entities`, it will return a list of Wikidata entities `Q` ids

## Other utils

- isNumericId
- getNumericId
- isWikidataId
- isWikidataEntityId
- isWikidataPropertyId
- normalizeId
- normalizeIds
- wikidataTimeToDateObject
- wikidataTimeToEpochTime
- wikidataTimeToISOString
- normalizeWikidataTime (aliased to wikidataTimeToEpochTime)


### A little [CoffeeScript](coffeescript.org) / [Promises](https://www.promisejs.org) workflow demo
that's how I love to work :)

```coffeescript
breq = require 'bluereq' # a little request lib returning bluebird-based promises

ids = ['Q647268', 'Q771376', 'Q860998', 'Q965704']
url = wdk.getEntities ids, user.language

breq.get(url)
.then wdk.parse.wd.entities
.then (entities)-> # do useful stuff with those entities data

```

## CLI
moved to [wikidata-cli](https://npmjs.com/package/wikidata-cli)

# License
[MIT](LICENSE.md)
