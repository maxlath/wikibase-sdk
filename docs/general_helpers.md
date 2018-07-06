# Helpers

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Work with ids](#work-with-ids)
  - [isItemId](#isitemid)
  - [isPropertyId](#ispropertyid)
  - [isEntityId](#isentityid)
  - [isNumericId](#isnumericid)
  - [isGuid](#isguid)
  - [getNumericId](#getnumericid)
- [Claims helpers](#claims-helpers)
  - [truthyClaims](#truthyclaims)
  - [truthyPropertyClaims](#truthypropertyclaims)
- [Sitelink helpers](#sitelink-helpers)
  - [getSitelinkUrl](#getsitelinkurl)
  - [getSitelinkData](#getsitelinkdata)
  - [isSitelinkKey](#issitelinkkey)
- [Wikidata Time converters](#wikidata-time-converters)
  - [wikidataTimeToDateObject](#wikidatatimetodateobject)
  - [wikidataTimeToEpochTime](#wikidatatimetoepochtime)
  - [wikidataTimeToISOString](#wikidatatimetoisostring)
  - [wikidataTimeToSimpleDay](#wikidatatimetosimpleday)
  - [getImageUrl](#getimageurl)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Work with ids

### isItemId
item ids a.k.a. `Q` ids

### isPropertyId
Property ids a.k.a. `P` ids

### isEntityId
Accepts both `P` and `Q` ids

### isNumericId

### isGuid

### getNumericId

## Claims helpers
### truthyClaims
Filter-out non-[truthy](https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements) claims from an `entity.claims` object
```js
const entityTruthyClaims = wdk.truthyClaims(entity.claims)
```

### truthyPropertyClaims
Filter-out non-[truthy](https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements) claims from an `entity.claims[prop]` array
```js
const entityP135TruthyClaims = wdk.truthyPropertyClaims(entity.claims.P135)
```

## Sitelink helpers
### getSitelinkUrl
```js
// multiple arguments interface
wdk.getSitelinkUrl(site, title)

wdk.getSitelinkUrl('commons', 'Lyon')
// => 'https://commons.wikimedia.org/wiki/Lyon'

wdk.getSitelinkUrl('frwiki', 'Septembre')
// => 'https://fr.wikipedia.org/wiki/Septembre'

wdk.getSitelinkUrl('zhwikiquote', '維克多·雨果')
// => 'https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C'
```
```js
// object interface: allow you to directly pass the API sitelink object
wdk.getSitelinkUrl({ site, title })

wdk.getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })
// => 'https://fr.wikipedia.org/wiki/Septembre'

wdk.getSitelinkUrl({ site: 'eswikiquote', title: 'Gilles Deleuze' })
// => 'https://es.wikiquote.org/wiki/Gilles_Deleuze'

wdk.getSitelinkUrl({ site: 'commons', title: 'Lyon' })
// => 'https://commons.wikimedia.org/wiki/Lyon'

wdk.getSitelinkUrl({ site: 'wikidata', title: 'Q1' })
// => 'https://wikidata.org/wiki/Q1'

wdk.getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })
// => 'https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C'
```

### getSitelinkData
```js
getSitelinkData('frwiki')
// => { lang: 'fr', project: 'wikipedia' }
getSitelinkData('dewikiquote')
// => { lang: 'de', project: 'wikiquote' }

// Using 'en' as placeholder lang for commons and wikidata
getSitelinkData('commons')
// => { lang: 'en', project: 'commons' }
getSitelinkData('wikidata')
// => { lang: 'en', project: 'wikidata' }
```

### isSitelinkKey
```js
isSitelinkKey('frwiki')
// => true
isSitelinkKey('dewikiquote')
// => true
isSitelinkKey('commons')
// => true
// Accepting wikidata as a valid sitelink for convenience
isSitelinkKey('wikidata')
// => true
isSitelinkKey('frwikilinpinpin')
// => false
// /!\ langs are loosly validated
isSitelinkKey('imaginarylangwiki')
// => true
```

## Wikidata Time converters
> See [Wikidata time values](https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times)

### wikidataTimeToDateObject

### wikidataTimeToEpochTime

### wikidataTimeToISOString
Uses [extended years following ECMAScript standard](https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15.1)
```js
var wikidataTime = '+1885-05-22T00:00:00Z'
wdk.wikidataTimeToISOString(wikidataTime)
// => '1885-05-22T00:00:00.000Z'

wikidataTime = '+0180-03-17T00:00:00Z'
wdk.wikidataTimeToISOString(wikidataTime)
// => '0180-03-17T00:00:00.000Z'

wikidataTime = '-0398-00-00T00:00:00Z'
wdk.wikidataTimeToISOString(wikidataTime)
// => '-000398-01-01T00:00:00.000Z'

```
that should also work for dates far in the past or the future:
```js
wikidataTime = '-13798000000-00-00T00:00:00Z'
wdk.wikidataTimeToISOString(wikidataTime)
// => '-13798000000-01-01T00:00:00Z'

```
This is the time normalizer used by `simplify.claims` functions

### wikidataTimeToSimpleDay
Returns dates on the format 'yyyy-mm-dd', 'yyyy-mm', 'yyyy' depending on the date precision. The benefit over the iso or the epoch format is that it preserves the precision.

It is thus possible, and prefered, to pass it the full datavalue value object to let it take the precision in account:
```js
const claims = {
  "P569": [
    {
      "mainsnak": {
        "snaktype": "value",
        "property": "P569",
        "hash": "4a6b80ab71c1ba78cb3a14aacd4e2f68690ab2e8",
        "datavalue": {
          "value": {
            "time": "+1869-11-01T00:00:00Z",
            "timezone": 0,
            "before": 0,
            "after": 0,
            "precision": 10,
            "calendarmodel": "http://www.wikidata.org/entity/Q1985727"
          },
          "type": "time"
        },
        "datatype": "time"
      },
      "type": "statement",
      "id": "Q970917$D52C5A12-C810-4B5E-A3C1-0FAB8808F902",
      "rank": "normal"
    }
  ]
}

// Passing only the time string: the result misses the month precision
// and thus wrongly returns the day set to '01'
wdk.wikidataTimeToSimpleDay(claims.P569[0].mainsnak.datavalue.value.time)
// => '1869-11-01'

// Passing the whole value object, the function can
wdk.wikidataTimeToSimpleDay(claims.P569[0].mainsnak.datavalue.value)
// => '1869-11'
```

### getImageUrl
Get an image URL from a Wikimedia Commons filename:
```js
wdk.getImageUrl('Peredot.jpg')
// => https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg
wdk.getImageUrl('Peredot.jpg', 250)
// => https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg?width=250
```
