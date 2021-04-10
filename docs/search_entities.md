# Search entities

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [searchEntities](#searchentities)
  - [entities type](#entities-type)
- [cirrusSearchPages](#cirrussearchpages)
  - [haswbstatement](#haswbstatement)
  - [namespace](#namespace)
  - [profile](#profile)
  - [sort](#sort)
  - [other parameters](#other-parameters)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## searchEntities
*associated Wikibase API doc: [wbsearchentities](https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities)*

```js
const url = wbk.searchEntities('Ingmar Bergman')
```

this returns a query url that you are then free to request with the tool you like
```
https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Ingmar%20Bergman&language=en&limit=20&format=json
```

This search endpoint, `wbsearchentities`, is the one used by the search bar and autocomplete fields on Wikibase GUI.

With more parameters:
```js
const search = 'Ingmar Bergman'
const language = 'fr' // will default to 'en'
const limit = 10 // defaults to 20
const format = 'json' // defaults to json

const url = wbk.searchEntities(search, language, limit, format)
```
which can also be passed as an object:
```js
const url = wbk.searchEntities({
  search: 'Ingmar Bergman',
  format: 'xml',
  language: 'sv',
  limit: 30,
  continue: 10
})
```

By default, the `uselang` parameter (the language in which the search results are returned) is set to the same as the language passed, but if for some weird use case you need to set a different language, you can still pass a 2 letters language code:
* as last argument (inline interface)
```js
const uselang = 'eo'
const url = wbk.searchEntities(search, language, limit, format, uselang)
```
* or set `uselang` in the option object (object interface).
```js
const url = wbk.searchEntities({
  search: 'Ingmar Bergman',
  language: 'sv',
  uselang: 'eo'
})
```
If the values aren't available in the desired language, it will fallback to the English value if available.

### entities type
You can request a specific type of entity by setting the `type` parameter to either `item` (default), `property`, `lexeme`, `form`, or `sense`:
```js
const url = wbk.searchEntities({ search: 'alphabet', type: 'property' })
```

## cirrusSearchPages
*associated Wikibase API doc: [action=query&list=search](https://www.wikidata.org/w/api.php?action=help&modules=query%2Bsearch)*

This alternative search mode allows to use the [`WikibaseCirrusSearch`](https://www.mediawiki.org/wiki/Help:Extension:WikibaseCirrusSearch) features, such as [`haswbstatement`](#haswbstatement).

```js
// Note that the search is case-insensitive
const url = wbk.cirrusSearchPages({ search: 'ingmar bergman' })
```

Due to the endpoint not returning much data other than the page title, a full example could look something like this:
```js
const fetch = require('node-fetch')
// or just window.fetch, if you are working in the browser

const url = wbk.cirrusSearchPages({ search: 'Ingmar Bergman' })

fetch(url)
.then(res => res.json())
.then(wbk.parse.wb.pagesTitles)
.then(titles => {
  // If you where searching in an entity namespace, which is the default namespace on Wikibase instances,
  // those titles are either entities ids (ex: Q1) or prefixed entities ids (ex: Item:Q1)
  // In the first case, we can just do
  const ids = titles
  // In the second case, to get the ids, we need to drop the prefix
  const ids = titles.map(title => title.split(':')[1])
  // From there, to get the full entities data, you could do
  const entitiesUrl = wbk.getEntities({ ids })
  return fetch(entitiesUrl)
})
.then(res => res.json())
.then(entities => {
  // Yeah data!
})

```

### haswbstatement
*associated Wikibase API doc: [haswbstatement](https://www.mediawiki.org/wiki/Help:Extension:WikibaseCirrusSearch#haswbstatement)*

This feature requires that the Wikibase instance you are targetting has the `WikibaseCirrusSearch` extension installed: you can check that on `/wiki/Special:Version`

```js
// Search for instance of (P31) filmographies (Q1371849) matching "Ingmar Bergman"
const url = wbk.cirrusSearchPages({ search: 'Ingmar Bergman', haswbstatement: 'P31=Q1371849' })
// Search for instance of (P31) filmographies (Q1371849)
const url = wbk.cirrusSearchPages({ haswbstatement: 'P31=Q1371849' })

// AND
// Search for instance of (P31) filmographies (Q1371849) AND that have a main subject (P921)
const url = wbk.cirrusSearchPages({ haswbstatement: [ 'P31=Q1371849', 'P921' ] })

// OR
// Search for instance of (P31) filmographies (Q1371849) OR that have a main subject (P921)
const url = wbk.cirrusSearchPages({ haswbstatement: 'P31=Q1371849|P921' })

// NOT
// Search for entities that are not instance of (P31) human (Q5)
const url = wbk.cirrusSearchPages({ haswbstatement: '-P31=Q5' })

// Qualifiers
// Search for entities that depict (P180) a cat (Q146) of color (P462) black (P462)
const url = wbk.cirrusSearchPages({ haswbstatement: 'P180=Q146[P462=Q23445]' })
```

This can also be used to lookup external ids:
```js
const url = wbk.cirrusSearchPages({ haswbstatement: 'P227=4079154-3' })
```
but not that if your Wikibase instance offers a SPARQL endpoint, this can also be done with [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/master/docs/get_entities_reverse_claims.md)
```js
const url = wbk.getReverseClaims('P227', '4079154-3')
```

### namespace
By default, the search returns is run only on the main namespace (`0`), but it is possible to customize that, and use `cirrusSearchPages` to search pages from any namespace

```js
const url = wbk.cirrusSearchPages({
  search: 'Ingmar Bergman',
  // Only one namespace
  namespace: 2
  // Multiple namespaces
  namespace: [ 0, 1, 2, 3 ]
})
```

### profile
Customise the search profile:
```js
const url = wbk.cirrusSearchPages({
  search: 'Ingmar Bergman',
  profile: 'wikibase_config_entity_weight',
})
```

See [`srqiprofile`](https://www.wikidata.org/w/api.php?action=help&modules=query+search) for possible values

### sort
Customise the search sort algorithm:
```js
const url = wbk.cirrusSearchPages({
  search: 'Ingmar Bergman',
  sort: 'last_edit_asc',
})
```

See [`srsort`](https://www.wikidata.org/w/api.php?action=help&modules=query+search) for possible values

### other parameters

```js
const url = wbk.cirrusSearchPages({
  search: 'Ingmar Bergman', // Becomes 'srsearch' in the url
  limit: 100, // Default: 10. Becomes 'srlimit' in the url
  offset: 500, // Default: 0. Becomes 'sroffset' in the url
  format: 'xml', // Default: json
})
```
