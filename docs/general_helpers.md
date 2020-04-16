# Helpers

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Work with ids](#work-with-ids)
  - [isEntityId](#isentityid)
  - [isItemId](#isitemid)
  - [isPropertyId](#ispropertyid)
  - [isLexemeId](#islexemeid)
  - [isFormId](#isformid)
  - [isSenseId](#issenseid)
  - [isNumericId](#isnumericid)
  - [isGuid](#isguid)
  - [isRevisionId](#isrevisionid)
  - [getNumericId](#getnumericid)
- [Claims helpers](#claims-helpers)
  - [truthyClaims](#truthyclaims)
  - [truthyPropertyClaims](#truthypropertyclaims)
- [Sitelink helpers](#sitelink-helpers)
  - [getSitelinkUrl](#getsitelinkurl)
  - [getSitelinkData](#getsitelinkdata)
  - [isSitelinkKey](#issitelinkkey)
- [Wikibase Time converters](#wikibase-time-converters)
  - [wikibaseTimeToDateObject](#wikibasetimetodateobject)
  - [wikibaseTimeToEpochTime](#wikibasetimetoepochtime)
  - [wikibaseTimeToISOString](#wikibasetimetoisostring)
  - [wikibaseTimeToSimpleDay](#wikibasetimetosimpleday)
  - [getImageUrl](#getimageurl)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Work with ids
Those helpers help you figure-out if an id format looks right, not that the associated entity really exists. Typically to be used in conditions:
```js
if (wbk.isItemId(someId)) doThis()
else if (wbk.isPropertyId(someId)) doThat()
```

### isEntityId
Accepts `Q` (item), `P` (property), and `L` (lexeme) ids.
```js
wbk.isEntityId('Q1') // true
wbk.isEntityId('P1') // true
wbk.isEntityId('L1') // true
wbk.isEntityId('L1-F1') // false
wbk.isEntityId('L1-S1') // false
```

### isItemId
item ids a.k.a. `Q` ids
```js
wbk.isItemId('Q1') // true
wbk.isItemId('P1') // false
```

### isPropertyId
Property ids a.k.a. `P` ids
```js
wbk.isPropertyId('P1') // true
wbk.isPropertyId('Q1') // false
```

### isLexemeId
Property ids a.k.a. `L` ids
```js
wbk.isLexemeId('L1') // true
wbk.isLexemeId('L1-F1') // false
wbk.isLexemeId('L1-S1') // false
```

### isFormId
Property ids a.k.a. `L` ids
```js
wbk.isFormId('L1-F1') // true
wbk.isFormId('L1') // false
wbk.isFormId('L1-S1') // false
```

### isSenseId
Property ids a.k.a. `L` ids
```js
wbk.isSenseId('L1-S1') // true
wbk.isSenseId('L1') // false
wbk.isSenseId('L1-F1') // false
```

### isNumericId

### isGuid

### isRevisionId

### getNumericId

## Claims helpers
### truthyClaims
Filter-out non-[truthy](https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements) claims from an `entity.claims` object
```js
const entityTruthyClaims = wbk.truthyClaims(entity.claims)
```

### truthyPropertyClaims
Filter-out non-[truthy](https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements) claims from an `entity.claims[prop]` array
```js
const entityP135TruthyClaims = wbk.truthyPropertyClaims(entity.claims.P135)
```

## Sitelink helpers
### getSitelinkUrl
```js
// multiple arguments interface
wbk.getSitelinkUrl(site, title)

wbk.getSitelinkUrl('commons', 'Lyon')
// => 'https://commons.wikimedia.org/wiki/Lyon'

wbk.getSitelinkUrl('frwiki', 'Septembre')
// => 'https://fr.wikipedia.org/wiki/Septembre'

wbk.getSitelinkUrl('zhwikiquote', '維克多·雨果')
// => 'https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C'
```
```js
// object interface: allow you to directly pass the API sitelink object
wbk.getSitelinkUrl({ site, title })

wbk.getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })
// => 'https://fr.wikipedia.org/wiki/Septembre'

wbk.getSitelinkUrl({ site: 'eswikiquote', title: 'Gilles Deleuze' })
// => 'https://es.wikiquote.org/wiki/Gilles_Deleuze'

wbk.getSitelinkUrl({ site: 'commons', title: 'Lyon' })
// => 'https://commons.wikimedia.org/wiki/Lyon'

wbk.getSitelinkUrl({ site: 'wikidata', title: 'Q1' })
// => 'https://wikidata.org/wiki/Q1'

wbk.getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })
// => 'https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C'
```

### getSitelinkData
```js
getSitelinkData('https://de.wikipedia.org/wiki/Kernfusion')
// => {
//      lang: 'de',
//      project: 'wikipedia',
//      key: 'dewiki',
//      title: 'Kernfusion',
//      url: 'https://de.wikipedia.org/wiki/Kernfusion'
//   }

getSitelinkData('https://www.wikidata.org/wiki/Q13082')
// => {
//      lang: 'en', // Using 'en' as placeholder lang for commons and wikidata
//      project: 'wikidata',
//      key: 'wikidata',
//      title: 'Q13082',
//      url: 'https://www.wikidata.org/wiki/Q13082'
//   }

// Can also be used to get basic data from a sitelink key
getSitelinkData('frwiki')
// => { lang: 'fr', project: 'wikipedia', key: 'frwiki' }

getSitelinkData('dewikiquote')
// => { lang: 'de', project: 'wikiquote', key: 'dewikiquote' }

getSitelinkData('commonswiki')
// => { lang: 'en', project: 'commons', key: 'commonswiki' }
getSitelinkData('wikidatawiki')
// => { lang: 'en', project: 'wikidata', key: 'wikidatawiki' }
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

## Wikibase Time converters
> See [Wikibase time values](https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times)

### wikibaseTimeToDateObject

### wikibaseTimeToEpochTime

### wikibaseTimeToISOString
Uses [extended years following ECMAScript standard](https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15.1)
```js
var wikibaseTime = '+1885-05-22T00:00:00Z'
wbk.wikibaseTimeToISOString(wikibaseTime)
// => '1885-05-22T00:00:00.000Z'

wikibaseTime = '+0180-03-17T00:00:00Z'
wbk.wikibaseTimeToISOString(wikibaseTime)
// => '0180-03-17T00:00:00.000Z'

wikibaseTime = '-0398-00-00T00:00:00Z'
wbk.wikibaseTimeToISOString(wikibaseTime)
// => '-000398-01-01T00:00:00.000Z'

```
that should also work for dates far in the past or the future:
```js
wikibaseTime = '-13798000000-00-00T00:00:00Z'
wbk.wikibaseTimeToISOString(wikibaseTime)
// => '-13798000000-01-01T00:00:00Z'

```
This is the time normalizer used by `simplify.claims` functions

### wikibaseTimeToSimpleDay
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
wbk.wikibaseTimeToSimpleDay(claims.P569[0].mainsnak.datavalue.value.time)
// => '1869-11-01'

// Passing the whole value object, the function can
wbk.wikibaseTimeToSimpleDay(claims.P569[0].mainsnak.datavalue.value)
// => '1869-11'
```

### getImageUrl
Get an image URL from a Wikimedia Commons filename:
```js
wbk.getImageUrl('Peredot.jpg')
// => https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg
wbk.getImageUrl('Peredot.jpg', 250)
// => https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg?width=250
```
