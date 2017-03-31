# Helpers

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Work with ids](#work-with-ids)
  - [isItemId](#isitemid)
  - [isPropertyId](#ispropertyid)
  - [isEntityId](#isentityid)
  - [isNumericId](#isnumericid)
  - [getNumericId](#getnumericid)
- [Wikidata Time converters](#wikidata-time-converters)
  - [wikidataTimeToDateObject](#wikidatatimetodateobject)
  - [wikidataTimeToEpochTime](#wikidatatimetoepochtime)
  - [wikidataTimeToISOString](#wikidatatimetoisostring)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Work with ids

### isItemId
item ids a.k.a. `Q` ids

### isPropertyId
Property ids a.k.a. `P` ids

### isEntityId
Accepts both `P` and `Q` ids

### isNumericId

### getNumericId

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
until it can't: when the date are too far in the past or the future, it will simply return the Wikidata time
```js
wikidataTime = '-13798000000-00-00T00:00:00Z'
wdk.wikidataTimeToISOString(wikidataTime)
// => '-13798000000-00-00T00:00:00Z'

```
This is the time normalizer used by `simplify.claims` functions