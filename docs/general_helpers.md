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
  - [isGuid](#isguid)
  - [isHash](#ishash)
  - [isPropertyClaimsId](#ispropertyclaimsid)
  - [isEntitySchemaId](#isentityschemaid)
  - [isRevisionId](#isrevisionid)
  - [isNumericId](#isnumericid)
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
  - [getEntityIdFromGuid](#getentityidfromguid)

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

### isGuid
The global unique `id` of a claim
```js
isGuid('q520$7f95c04f-4cb6-b018-80eb-fefe0e0bf377') // true
isGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec6') // true
```

### isHash
The hash of a claim, qualifier, or reference
```js
isHash('14ddd544b82e2f811669d2bb4c939c4997536ce3') // true
```

### isPropertyClaimsId
Property claims id is a non-official term to refer to a group of claims an entity has for a given property
```js
isPropertyClaimsId('Q1#P1') // true
isPropertyClaimsId('P12#P12') // true
isPropertyClaimsId('L123#P123') // true
```

### isEntitySchemaId
```js
isEntitySchemaId('E123') // true
```

### isRevisionId

### isNumericId

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

### getEntityIdFromGuid
You would think it's trivial, but actually GUIDs' case is inconsistent, so we need to take care of that once for all
```js
getEntityIdFromGuid('Q520$91F0CCEA-19E4-4CEB-97D9-74B014C14686')
// => 'Q520'
getEntityIdFromGuid('q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C')
// => 'Q520'
getEntityIdFromGuid('L525$faeae005-4b75-1319-5516-e08a8bdd0e9c')
// => 'L525'
getEntityIdFromGuid('L525-F2$52c9b382-02f5-4413-9923-26ade74f5a0d')
// => 'L525-F2'
getEntityIdFromGuid('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48')
// => 'L525-S1'
getEntityIdFromGuid('P6216$a7fd6230-496e-6b47-ca4a-dcec5dbd7f95')
// => 'P6216'
```
Hyphenated GUIDs, such as returned by the Query Service, can also be passed:
```js
getEntityIdFromGuid('q520-BCA8D9DE-B467-473B-943C-6FD0C5B3D02C')
// => Q520
getEntityIdFromGuid('Q520-91F0CCEA-19E4-4CEB-97D9-74B014C14686')
// => Q520
getEntityIdFromGuid('q520-7f95c04f-4cb6-b018-80eb-fefe0e0bf377')
// => Q520
getEntityIdFromGuid('Q520-4a0b85a0-4a47-3254-0379-52680370fec6')
// => Q520
getEntityIdFromGuid('L525-faeae005-4b75-1319-5516-e08a8bdd0e9c')
// => L525
getEntityIdFromGuid('L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d')
// => L525-F2
getEntityIdFromGuid('L525-S1-66D20252-8CEC-4DB1-8B00-D713CFF42E48')
// => L525-S1
getEntityIdFromGuid('P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95')
// => P6216
getEntityIdFromGuid('Q520-4a0b85a0-4a47-3254-0379-52680370fec')
// => Q520
```
