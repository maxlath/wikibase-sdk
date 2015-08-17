![wikidata](https://pbs.twimg.com/profile_images/2498571390/cizdiwz4oiiq1zae94jp.png)

A javascript tool-suite to query [wikidata](http://wikidata.org/) and handle its results.

This library had for primary purpose to serve the needs of the (inventaire)[https://github.com/inventaire/inventaire] project but extending its capabilities to other needs it totally possible: feel welcome to post your suggestions as issues or pull requests!

used APIs:
- [wikidata API](https://www.wikidata.org/w/api.php)
- [wmlabs WDQ](http://wdq.wmflabs.org/api_documentation.html)

# Summary
- [Installation](https://github.com/maxlath/wikidata-sdk#installation)
  - [via NPM](https://github.com/maxlath/wikidata-sdk#via-npm)
  - [via Bower](https://github.com/maxlath/wikidata-sdk#via-bower)
  - [The Old Way](https://github.com/maxlath/wikidata-sdk#the-old-way)
- [How-to](https://github.com/maxlath/wikidata-sdk#how-to)
  - [Build queries urls to:](https://github.com/maxlath/wikidata-sdk#build-queries-urls-to)
    - [search in wikidata entities](https://github.com/maxlath/wikidata-sdk#search-in-wikidata-entities)
    - [get entities by id](https://github.com/maxlath/wikidata-sdk#get-entities-by-id)
    - [get entities reverse claims](https://github.com/maxlath/wikidata-sdk#get-entities-reverse-claims)
  - [Other utils](https://github.com/maxlath/wikidata-sdk#other-utils)
    - [simplify claims results](https://github.com/maxlath/wikidata-sdk#simplify-claims-results)
  - [Misc](https://github.com/maxlath/wikidata-sdk#misc)
- [A little CoffeeScript / Promises workflow demo](https://github.com/maxlath/wikidata-sdk#a-little-coffeescript--promises-workflow-demo)
- [License](https://github.com/maxlath/wikidata-sdk#license)


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

```javascript
var url = wdk.searchEntities('Ingmar Bergman');
```

or with more parameters:
```javascript
var search = 'Ingmar Bergman'
var languages = 'fr' // will default to 'en'
var limit = 10 // default 20
var format = 'json' // default to json

var url = wdk.searchEntities(search, languages, limit, format);
```
this returns a query url that you are then free to request with the tool you like
```
https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Ingmar%20Bergman&language=en&limit=20&format=json
```

### get entities by id

on the same pattern

```javascript
var url = wdk.getEntities(ids, languages, properties, format)
```

properties being wikidata entities' properties: info, sitelinks, labels, descriptions, claims.

ids, languages, properties can get either one single value as a string or several values in a array


### get entities reverse claims

In wikidata API answers, you can only access claims on the entity's page, not claims pointing to this entity (what would be in the "what links here" page).

Fortunatly, you can query wikimedia awesome WDQ tool \o/

For instance, let's say you want to find all the entities that have Leo Tolstoy ([Q7243](http://www.wikidata.org/entity/Q7243)) for author ([P50](http://www.wikidata.org/entity/P50))

```javascript
var url = wdk.getReverseClaims('P50', 'Q7243');
```

and you can then query the obtained entities ids

```javascript
request(url, function(err, response){
  if (err) { dealWithError(err) };
  var entities = wdk.parse.wdq.entities(response);
  var url2 = wdk.getEntities(entities);
  request(url2 ....
});
```

it also work for string values: e.g. let's say you want to find which book as 978-0-465-06710-7 for ISBN-13 ([P212](http://www.wikidata.org/entity/P212)):

```javascript
var url = wdk.getReverseClaims('P212', '978-0-465-06710-7');
```

## Other utils

### simplify claims results
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

you just need to pass your entity' claims object to simplifyClaims as such:
```javascript
var simpleClaims = wdk.simplifyClaims(claims);

```

in your workflow, that could give something like:

```javascript
var url = wdk.getEntities('Q535');
request(url, function(err, response){
  if (err) { dealWithError(err) };
  var entity = response.entities.Q535;
  entity.claims = wdk.simplifyClaims(entity.claims);
});
```


### Misc

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


### A little [CoffeeScript](coffeescript.org) / [Promises](https://www.youtube.com/watch?v=qbKWsbJ76-s) workflow demo
that's how I love to work :)

```coffeescript
breq = require 'bluereq' # a little request lib returning bluebird-based promises

ids = ['Q647268', 'Q771376', 'Q860998', 'Q965704']
url = wdk.getEntities ids, user.language

breq.get(url)
.then wdk.parse.wd.entities
.then (entities)-> # do useful stuff with those entities data

```

# License
[MIT](LICENSE.md)
