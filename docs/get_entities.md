# Get entities

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [By ids](#by-ids)
    - [Get many entities by ids](#get-many-entities-by-ids)
  - [By Wikipedia titles](#by-wikipedia-titles)
  - [By other Wikimedia projects titles](#by-other-wikimedia-projects-titles)
- [Examples](#examples)
  - [A little Promises workflow demo](#a-little-promises-workflow-demo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## By ids
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

on the same pattern

```js
const ids = 'Q571' // could also be several ids as an array: ['Q1', 'Q5', 'Q571']
const languages = ['en', 'fr', 'de'] // returns all languages if not specified
const props = ['info', 'claims'] // returns all data if not specified
const format = 'xml' // defaults to json
const url = wdk.getEntities(ids, languages, props, format)
```

props being wikidata entities' properties: info, sitelinks, labels, descriptions, claims.

ids, languages, props can get either one single value as a string or several values in a array


And Again, this can also be passed as an object:
```js
const url = wdk.getEntities({
  ids: ['Q1', 'Q5', 'Q571'],
  languages: ['en', 'fr', 'de'], // returns all languages if not specified
  props: ['info', 'claims'], // returns all data if not specified
  format: 'xml' // defaults to json
})
```

### Get many entities by ids
Above 50 ids, `wdk.getEntities` will warn you that your request won't be fully fullfiled by Wikidata API due to its limitations policy.
You can use `wdk.getManyEntities` instead to generate several request urls to work around this limitation:

The arguments API is the same as getEntities:
```js
const urls = wdk.getManyEntities(['Q1', 'Q2', 'Q3', ..., 'Q123'])
// or
const urls = wdk.getManyEntities(['Q1', 'Q2', 'Q3', ..., 'Q123'], ['en', 'fr', 'de'], ['info', 'claims'], 'json')
// or
const urls = wdk.getManyEntities({
  ids: ['Q1', 'Q2', 'Q3', ..., 'Q123'],
  languages: ['en', 'fr', 'de'],
  props: ['info', 'claims'],
  format: 'json'
})
```
but it returns an array of urls instead.

:warning: This limitation policy was probably there for a reason, right? This should be the exception, make sure to set an interval between your requests (500ms, 1s?), and if you really need a lot of entities, consider using [dumps](https://www.wikidata.org/wiki/Wikidata:Database_download#JSON_dumps_.28recommended.29): there are [great tools](https://github.com/maxlath/wikidata-filter) to work with those too! ;)

## By Wikipedia titles
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

This can be very useful when you work with a list of Wikipedia articles in a given language and would like to move to Wikidata for all the awesomeness it provides:
```js
const url = wdk.getWikidataIdsFromWikipediaTitles('Hamburg')
//=> 'https://www.wikidata.org/w/api.php?action=wbgetentities&titles=Hamburg&sites=enwiki&format=json'

const url = wdk.getWikidataIdsFromWikipediaTitles(['Hamburg', 'Lyon', 'Berlin'])
// => 'https://www.wikidata.org/w/api.php?action=wbgetentities&titles=Hamburg%7CLyon%7CBerlin&sites=enwiki&format=json'
```

By default, it looks in the English Wikipedia, but we can change that:
```js
const titles = 'Hamburg'
const sites = 'dewiki' // or you can just pass the 2-letters language codes: 'de'
const languages = ['en', 'fr', 'de'] // those are the languages in which we would like the entities data
const props = ['info', 'claims']
const format = 'json'
const url = wdk.getWikidataIdsFromWikipediaTitles(titles, sites, languages, props, format)
```
or using the object interface:
```js
const url = wdk.getWikidataIdsFromWikipediaTitles({
  titles: 'Hamburg',
  sites: 'dewiki',
  languages: ['en', 'fr', 'de'],
  props: ['info', 'claims'],
  format: 'json'
})
```

## By other Wikimedia projects titles
*associated Wikidata doc: [wbgetentities](https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities)*

This is exactly the same interface as with `getWikidataIdsFromWikipediaTitles`, you just need to specify the sitelink in the form `{2 letters language code}{project}`

```js
const url = wdk.getEntitiesFromSitelinks('Victor Hugo', 'frwikisource')
```

Actually, `getWikidataIdsFromWikipediaTitles` is just an alias of `getEntitiesFromSitelinks`, so you can use it for Wikipedia too:
```js
const url = wdk.getEntitiesFromSitelinks('Victor Hugo', 'frwiki')
// or given it defauts to the Wikipedia project:
const url = wdk.getEntitiesFromSitelinks('Victor Hugo', 'fr')
```

# Examples

## A little [Promises](https://www.promisejs.org) workflow demo
that's how I love to work :)

```js
// a little request lib returning bluebird-based promises
const breq = require('bluereq')
const ids = ['Q647268', 'Q771376', 'Q860998', 'Q965704']
const url = wdk.getEntities(ids, user.language)

breq.get(url)
.then(wdk.parse.wd.entities)
.then(entities => // do your thing with those entities data)
```
