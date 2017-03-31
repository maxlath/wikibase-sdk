# Simplify claims
*associated Wikidata doc: [DataModel](https://www.mediawiki.org/wiki/Wikibase/DataModel)*

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Intro](#intro)
- [simplify.claims](#simplifyclaims)
- [simplify.propertyClaims](#simplifypropertyclaims)
- [simplify.claim](#simplifyclaim)
- [Options](#options)
  - [Add prefixes to entities and properties ids](#add-prefixes-to-entities-and-properties-ids)
  - [Keep qualifiers](#keep-qualifiers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Intro
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

That's what `simplify.claims`, `simplify.propertyClaims`, `simplify.claim` do, each at their own level.

## simplify.claims
you just need to pass your entity' claims object to simplify.claims as such:
```js
const simplifiedClaims = wdk.simplify.claims(entity.claims)
```

in your workflow, that could give something like:

```js
const url = wdk.getEntities('Q535')
request(url, function(err, response){
  if (err) { dealWithError(err) }
  const entity = response.entities.Q535
  simplifiedClaims = wdk.simplify.claims(entity.claims)
})
```

To keep things simple, "weird" values are removed (for instance, statements of datatype `wikibase-item` but set to `somevalues` instead of the expected Q id)

## simplify.propertyClaims
Same as simplify.claims but expects an array of claims, typically the array of claims of a specific property:
```js
const simplifiedP31Claims = wdk.simplify.propertyClaims(entity.claims.P31)
```

## simplify.claim
Same as simplify.claims but expects a unique claim
```js
const simplifiedP31Claim = wdk.simplify.claim(entity.claims.P31[0])
```


## Options

### Add prefixes to entities and properties ids
> `entityPrefix`, `propertyPrefix`

It may be useful to prefix entities and properties ids in case you work with data from several domains/sources. This can done by setting an entity prefix and/or a property prefix in the options:
```js
const options = { entityPrefix: 'wd', propertyPrefix: 'wdt' }
wdk.simplify.claims(entity.claims, options)
wdk.simplify.propertyClaims(entity.claims.P31, options)
wdk.simplify.claim(entity.claims.P31[0], options)
```
Results would then look something like
```json
{
  "wdt:P279": [ "wd:Q340169", "wd:Q2342494", "wd:Q386724" ]
}
```

### Keep qualifiers
> `keepQualifiers`

You can keep qualifiers by passing `keepQualifiers: true` in the options:
```js
wdk.simplify.claims(entity.claims, { keepQualifiers: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepQualifiers: true })
wdk.simplify.claim(entity.claims.P50[0], { keepQualifiers: true })
```
Results would then look something like
```json
{
  "P50": [
    {
      "value": "Q5111731",
      "qualifiers": { "P1545": ["17"], "P1416": ["Q1341845"]}
    },
    {
      "value": "Q20895241",
      "qualifiers": { "P1545": ["8"]," P1416": ["Q19845644"]}
    },
    {
      "value": "Q27863244",
      "qualifiers": { "P1545": ["7"]," P1416": ["Q678765"]}
    },
    {
      "value": "Q27887604",
      "qualifiers": { "P1545": ["10"], "P1416": ["Q640694"] }
    }
  ]
}
```

### Change time parser

By default, `simplify.claims` functions use [`wikidataTimeToISOString`](general_helpers.md#wikidataTimeToISOString) to parse [Wikidata time values](https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times).

You can nevertheless request to use a different converter by setting the option `timeConverter`.

Possible modes:

* `iso`: the default value
* `epoch`: get the time value as the milliseconds elapsed since 1 January 1970 00:00:00 UTC (as returned by [Javascript `getTime`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime))
* `none`: get the raw non-standard Wikidata `time` string (ex: `+1885-00-00T00:00:00Z`)
