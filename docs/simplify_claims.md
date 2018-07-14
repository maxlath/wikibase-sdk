# Simplify claims
*associated Wikidata doc: [DataModel](https://www.mediawiki.org/wiki/Wikibase/DataModel)*

`simplify.claims` functions are part of the larger [`simplify.entity` functions family](simplify_entities_data.md)

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Intro](#intro)
- [simplify.claims](#simplifyclaims)
- [simplify.propertyClaims](#simplifypropertyclaims)
- [simplify.claim](#simplifyclaim)
- [simplify.qualifier](#simplifyqualifier)
- [simplify.propertyQualifiers](#simplifypropertyqualifiers)
- [simplify.qualifiers](#simplifyqualifiers)
- [Options](#options)
  - [Add prefixes to entities and properties ids](#add-prefixes-to-entities-and-properties-ids)
  - [Keep rich values](#keep-rich-values)
  - [Keep types](#keep-types)
  - [Keep qualifiers](#keep-qualifiers)
  - [Keep references](#keep-references)
  - [Keep ids](#keep-ids)
  - [Keep hashes](#keep-hashes)
  - [Keep non-truthy statements](#keep-non-truthy-statements)
  - [Change time parser](#change-time-parser)

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

## simplify.qualifier
Same interface as [simplify.claims](#simplifyclaims) but taking a qualifiers object

## simplify.propertyQualifiers
Same interface as [simplify.propertyClaims](#simplifypropertyclaims) but taking an array of qualifiers

## simplify.qualifiers
Same interface as [simplify.claim](#simplifyclaim) but taking a qualifier object

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

### Keep rich values
> `keepRichValues`

By default, `simplify.claims` returns only the simpliest values, so just a string for `monolingualtext` values and just a number for `quantity` values.
By setting `keepRichValues=true`,
- `monolingualtext` values will be objects on the pattern `{ text, language }`
- `quantity` values will be objects on the pattern `{ amount, unit, upperBound, lowerBound }`

### Keep types
> `keepTypes`

You can keep the value's types by passing `keepTypes: true` in the options:
```js
wdk.simplify.claims(entity.claims, { keepTypes: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepTypes: true })
wdk.simplify.claim(entity.claims.P50[0], { keepTypes: true })
```
Results would then look something like
```json
{
  "P1365": [
    {
      "value": "Q312881",
      "type": "wikibase-item"
    }
  ]
}
```

Here is a list with all the supported types:

 - `"string"`
 - `"commonsMedia"`
 - `"url"`
 - `"external-id"`
 - `"math"`
 - `"monolingualtext"`
 - `"wikibase-item"`
 - `"wikibase-property"`
 - `"time"`
 - `"quantity"`
 - `"globe-coordinate"`
 - `"geo-shape"`
 - `"tabular-data"`

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

### Keep references
> `keepReferences`

You can keep reference by passing `keepReferences: true` in the options:
```js
wdk.simplify.claims(entity.claims, { keepReferences: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepReferences: true })
wdk.simplify.claim(entity.claims.P50[0], { keepReferences: true })
```
Results would then look something like
```json
{
  "P50": [
    {
      "value": "Q5111731",
      "references": [
        { "P854": [ "https://zuper.trustable/source" ], "P143": [ "Q191769" ] }
        { "P248": [ "Q54919" ], "P813": [ "2015-08-02T00:00:00.000Z" ] }
      ]
    },
    {
      "value": "Q20895241",
      "references": [
        { "P854": ["https://zuper.trustable/source"]," P143": ["Q58255"] }
      ]
    }
  ]
}
```

### Keep ids
> `keepIds`

You can keep claim ids (a.k.a. `guid`), references and qualifiers hashes by passing `keepIds: true` in the options:

```js
wdk.simplify.claims(entity.claims, { keepIds: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepIds: true })
wdk.simplify.claim(entity.claims.P50[0], { keepIds: true })
```
Results would then look something like
```json
{
  "P50": [
    { "value": "Q5111731", "id": "Q22002395$77572369-41bb-6e47-f1cc-83658005ae0d" },
    { "value": "Q20895241", "id": "Q22002395$2767c477-4ff4-cf8c-6ef0-33d6a759a8bc" },
    { "value": "Q27863244", "id": "Q22002395$620c1c3a-4d7d-0b0f-6d54-92fd1a13b00a" }
  ]
}
```

### Keep hashes
> `keepHashes`

You can keep references and qualifiers hashes by passing `keepHashes: true` in the options:

```js
wdk.simplify.claims(entity.claims, { keepHashes: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepHashes: true })
wdk.simplify.claim(entity.claims.P50[0], { keepHashes: true })
```

This option has no effect if neither `keepQualifiers` nor `keepReferences` is `true`.


Results would then look something like
```json
{
  "P50": [
    {
      "value": "Q474605",
      "qualifiers": {
        "P580": [
          { "value": "1953-01-01T00:00:00.000Z", "hash": "3d22f4dffba1ac6f66f521ea6bea924e46df4129" }
        ]
      },
      "references": [
        { "snaks": { "P248": [ "Q54919" ], "P813": [ "2015-08-02T00:00:00.000Z" ] }, "hash": "d6b4bc80e47def2fab91836d81e1db62c640279c" }
      ]
    }
  ]
}
```

### Keep non-truthy statements
> `keepNonTruthy`

By default, [non-truthy statements](https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements) are ignored. This can be disable with this option.
```js
wdk.simplify.claims(entity.claims, { keepNonTruthy: true })
wdk.simplify.propertyClaims(entity.claims.P50, { keepNonTruthy: true })
```

### Change time parser

By default, `simplify.claims` functions use [`wikidataTimeToISOString`](general_helpers.md#wikidataTimeToISOString) to parse [Wikidata time values](https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times).

You can nevertheless request to use a different converter by setting the option `timeConverter`.

Possible modes:

* `iso`: the default value
* `epoch`: get the time value as the milliseconds elapsed since 1 January 1970 00:00:00 UTC (as returned by [Javascript `getTime`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime))
* `simple-day`: returns dates on the format 'yyyy-mm-dd', 'yyyy-mm', 'yyyy' depending on the date precision.
* `none`: get the raw non-standard Wikidata `time` string (ex: `+1885-00-00T00:00:00Z`)
