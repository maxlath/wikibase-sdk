# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 5.15.0 - 2018-07-21
* [`getReverseClaims`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/get_entities_reverse_claims.md): Added ability to query entities by multiple property values

## 5.14.0 - 2018-07-14
* Added [simplify.qualifier](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplifyqualifier), [simplify.propertyQualifiers](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplifypropertyqualifiers), [simplify.qualifiers](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplifyqualifiers) functions

## 5.13.0 - 2018-07-06
* Added [`isGuid`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#isguid) helper function
* Make [`wdk.simplifySparqlResults`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_sparql_results.md) format statement URIs as claims GUIDs

## 5.12.0 - 2018-06-27
* Added [`truthyClaims`](`https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#truthyclaims`) and [`truthyPropertyClaims`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#truthyPropertyClaims) functions
* Added [`simplify.entities`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-entities)

## 5.11.0 - 2018-05-19
* Added [`getImageUrl`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#getimageurl) helper

## 5.10.0 - 2018-05-14
* Added new option to `simplify.claims`:
  * [keep types](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-types) (thanks @moshest!)

## 5.9.0 - 2018-02-26
* [`Wikidata Time converters`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#wikidata-time-converters) now also accept a time value object to take in account the precision, which only makes a difference in the result for [`wikidataTimeToSimpleDay`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#wikidataTimeToSimpleDay)

## 5.8.0 - 2018-01-27
* Added [`wikidataTimeToSimpleDay`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#wikidataTimeToSimpleDay)

## 5.7.0 - 2017-12-20
* [`getReverseClaims`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/get_entities_reverse_claims.md): allow to request values for several properties at once

## 5.6.0 - 2017-12-14
* Added new sitelink helpers: [`getSitelinkData`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#getsitelinkdata) and [`isSitelinkKey`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#issitelinkkey)

## 5.5.0 - 2017-12-04
* Added new options to `simplify.sitelinks`:
  * [add url](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#add-sitelinks-urls)
* Added new sitelink helper: [`getSitelinkUrl`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#getsitelinkdata) and [`isSitelinkKey`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/general_helpers.md#getsitelinkurl)

## 5.4.0 - 2017-11-30
* Added a new option to `simplify.claims`:
  * [keep rich-values](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-rich-values)

## 5.3.0 - 2017-11-09
* Added new options to `simplify.claims`:
  * [keep references](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-references)
  * [keep ids](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-ids)
  * [keep hashes](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-hashes)

## 5.2.0 - 2017-06-10
* Added [`getRevisions`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/get_revisions.md)
* Added option `timeConverter` to [`simplify.claims`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md) functions

## 5.1.0 - 2017-03-31
* Added [`simplify.entity`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-entity)
* Added [`simplify.labels`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-labels)
* Added [`simplify.descriptions`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-descriptions)
* Added [`simplify.aliases`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-aliases)
* Added [`simplify.sitelinks`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-sitelinks)

## 5.0.0 - 2017-03-28
**Breaking Changes**:
* ([00e3c81](https://github.com/maxlath/wikidata-sdk/commit/00e3c81)) Fixed [naming issues](https://github.com/maxlath/wikidata-sdk/issues/15):
  * renamed `isWikidataId` => `isEntityId`
  * renamed `isWikidataEntityId` => `isItemId`
  * renamed `isWikidataPropertyId` => `isPropertyId`
* ([df4301a](https://github.com/maxlath/wikidata-sdk/commit/df4301a)) Removed helpers that were only needed to work with the now-offline WDQ service that is, all helpers dealing with entities ids in there numeric id form: `normalizeId`, `normalizeIds`, ~~`isNumericId`, `getNumericId`~~ (those last removal were reverted by ([2b5020e](https://github.com/maxlath/wikidata-sdk/commit/2b5020e)))
* ([a5ae25f](https://github.com/maxlath/wikidata-sdk/commit/a5ae25f)) Removed `normalizeWikidataTime` alias: use one of `wikidataTimeToDateObject`, `wikidataTimeToEpochTime`, `wikidataTimeToISOString` instead
* ([e2158f9](https://github.com/maxlath/wikidata-sdk/commit/e2158f9)) `simplifyClaims` functions now use `wikidataTimeToISOString` as time normalizer instead of `wikidataTimeToEpochTime`

## 4.3.0 - 2017-03-28
* Added `limit` and `caseInsensitive` options to [`getReverseClaims`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/get_entities_reverse_claims.md)

## 4.2.0 - 2017-01-02
* Added the option to [keep qualifiers](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-qualifiers) to `simplifyClaims` functions

## 4.1.0 - 2016-11-08
* [Simplify claims functions](https://github.com/maxlath/wikidata-sdk/blob/master/docs/#simplify-claims-results) now each accept a 2nd and 3rd optional arguments to [specify entity and property id prefixes](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#add-prefixes-to-entities-and-properties-ids)

## 4.0.0 - 2016-09-09
* Completly removed uses and references to wdq:
  * BREAKING CHANGE: [getReverseClaims](https://github.com/maxlath/wikidata-sdk/blob/master/docs/#get-entities-reverse-claims) now returns a query to the SPARQL endpoint. Its result should thus be parsed with [`wdk.simplifySparqlResults`](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_sparql_results.md) instead of `wdk.parse.wdq.entities`. This parser was thus removed.

## 3.2.0 - 2016-06-06
* Added [wdk.simplifySparqlResults](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_sparql_results.md)

## 3.1.0 - 2016-06-02
* Added [wdk.getManyEntities](https://github.com/maxlath/wikidata-sdk/blob/master/docs/#get-many-entities-by-id)

## 3.0.0 - 2016-05-13
* Extracting "bin" executables (qlabel, wikiqid) to there own modules: [wikidata-cli](https://github.com/maxlath/wikidata-cli). Bumping the major version as it could be considered a breaking change (despite the fact that those executables weren't really part of wikidata-sdk and that they were added very recently)

## 2.6.0 - 2016-04-28
* Added [CLI tools](https://github.com/maxlath/wikidata-sdk/blob/master/docs/#cli): qlabel and wikiqid

## 2.5.0 - 2016-04-18
* Added support for the uselang parameter in entities search

## 2.4.0 - 2016-04-15
* Added [wdk.simplifyClaim](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#simplifyclaim), [wdk.simplifyPropertyClaims](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#simplifypropertyclaims)

## 2.3.0 - 2016-02-17
* Added a SPARQL query url generator: [wdk.sparqlQuery](https://github.com/maxlath/wikidata-sdk/blob/master/docs/sparql_query.md)
