# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 9.2.0 - 2023-07-17
* [`simplifyEntity`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-entity): add support for MediaInfo entity type

## 9.1.0 - 2023-04-18
* export the `wikimediaLanguageCodes` array

## 9.0.0 - 2023-02-04

**BREAKING CHANGES**:
* `wikibase-sdk` now uses ES modules: to keep using CommonJS, you will need to use `wikibase-sdk <= v9`
* Some functions that were accepting arguments as several arguments were changed to accept arguments as an object only. The concerned functions are:
  * `getReverseClaims`: `getReverseClaims('P50', 'Q535')` should be replaced by `getReverseClaims({ properties: 'P50', values: 'Q535' })`
  * `getRevisions`: `getRevisions('Q3548931', { limit: 10 })` should be replaced by `getRevisions({ ids: 'Q3548931', { limit: 10 })`
* Functions that were accepting arguments either as several arguments or as an object now only accept arguments as an object. The concerned functions are:
  * [`searchEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md)
  * [`cirrusSearchPages`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md#cirrussearchpages)
  * [`getEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-ids)
  * [`getEntitiesFromSitelinks`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-sitelinks)
  * [`getEntityRevision`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-id-and-revision)
  * [`getManyEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#get-many-entities-by-ids)
  * [`getSitelinkUrl`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getsitelinkurl)
  * [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities_reverse_claims.md)
* `simplify.claims`, `simplify.propertyClaims`, and `simplify.claim` legacy interfaces were dropped: options are now expected in a single option object (rather than as several arguments)
* Functions previously avaialble on `wbk.parsers.wb` and `wbk.parsers.wd` — namely `entities` and `pagesTitles` — are now directly on `wbk.parsers`

Other changes:
* The source code was converted to TypeScript to recover types declarations, and keep them maintained in the future. This change was taken as an opportunity to do a bit of cleanup in the function interfaces.
* The convenience module `wikidata-sdk` has been deprecated. The `wdk` object can now be imported from `wikibase-sdk/wikidata.org`: `import wdk from 'wikibase-sdk/wikidata.org'`

## 8.1.0 - 2022-10-31
* new [`simplify.siteliks`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-sitelinks) option: [`keepBadges`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#keep-badges)

## 8.0.0 - 2022-05-03
**BREAKING CHANGE**: use `URLSearchParams` in NodeJS, which only is available in NodeJS `>= v10.0.0`

## 7.15.0 - 2021-04-10
* [`cirrusSearchPages`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md#cirrussearchpages): added support for `srprop` parameter

## 7.14.0 - 2021-10-18
* new [`simplify.claims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md) option: `keepNonDeprecated`

## 7.13.0 - 2021-06-01
* Added `wgScriptPath` to the initialization parameters

## 7.12.0 - 2021-05-01
* Added [`isEntitySchemaId`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#isentityschemaid)

## 7.11.0 - 2021-04-10
* Added [`simplify.references`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#simplify-references) function

## 7.10.0 - 2021-04-10
* Added [`cirrusSearchPages`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md#cirrussearchpages) function

## 7.9.0 - 2021-01-29
* [`getEntityIdFromGuid`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getentityidfromguid): added support for hyphenated GUIDs

## 7.8.0 - 2020-10-07
* Added function aliases:
  * `simplify.snak = simplify.claim`
  * `simplify.propertySnaks = simplify.propertyClaims`
  * `simplify.snaks = simplify.claims`

## 7.7.0 - 2020-07-15
* Added [`getEntityIdFromGuid`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getentityidfromguid) function

## 7.6.0 - 2020-06-09
* Added [`isPropertyClaimsId`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#ispropertyclaimsid) function

## 7.5.0 - 2020-06-08
* Added [`isHash`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#ishash) function

## 7.4.0 - 2020-04-17
* `simplify.entity`/`simplify.entities` function: added support for Lexemes
* Added [`simplify.lemmas`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-lemmas)) function
* Added [`simplify.glosses`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-glosses)) function
* Added [`simplify.form`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-form)) function
* Added [`simplify.forms`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-forms)) function
* Added [`simplify.sense`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-sense)) function
* Added [`simplify.senses`]((https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-senses)) function
* Added [`isFormId`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#isformid) function
* Added [`isSenseId`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#issenseid) function

## 7.3.0 - 2020-04-08
* [`getRevisions`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_revisions.md): added support for `rvprops`, `rvuser`, `rvexcludeuser`, and `rvtag` parameters

## 7.2.0 - 2019-12-06
* Make [`getSitelinkData`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getsitelinkdata) accept full article URLs and return `{ lang, project, key, title, url }`

## 7.1.0 - 2019-09-08
* Expose parsed instance URLs: `wbk.instance`

## 7.0.0 - 2019-05-31
**Breaking Changes**:
  * The module initialization was restructured to support Wikibase instances other than wikidata.org. As a consequence, while `require('wikibase-sdk')`  still produces the same object as before, `require('wikibase-sdk')` returns a function that takes a config object, which then returns the equivalent of the `wdk` object but customized for the desired Wikibase instance (see [import documentation](https://github.com/maxlath/wikibase-sdk#import)).
  * Dropping bower support [as it has been deprecated for a while now](https://bower.io/blog/2017/how-to-migrate-away-from-bower/): old versions of wikibase-sdk should still be available though
  * Renamed:
    * `wikidataTimeToEpochTime` => `wikibaseTimeToEpochTime`
    * `wikidataTimeToISOString` => `wikibaseTimeToISOString`
    * `wikidataTimeToSimpleDay` => `wikibaseTimeToSimpleDay`
  * Removed legacy aliases:
    * `simplifyClaim` (use `simplify.claim`)
    * `simplifyPropertyClaims` (use `simplify.propertyClaims`)
    * `simplifyClaims` (use `simplify.claims`)
    * `simplifySparqlResults` (use `simplify.sparqlResults`)
    * `getWikidataIdsFromWikipediaTitles` (use `getEntitiesFromSitelinks`)
    * `getWikidataIdsFromSitelinks` (use `getEntitiesFromSitelinks`)

## 6.7.0 - 2019-05-26
* [`simplify.claims` custom `timeConverter`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md): allow to pass a custom time converter function ([PR by @simon04](https://github.com/maxlath/wikibase-sdk/pull/59))

## 6.6.0 - 2019-05-17
* Added [`getEntityRevision`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-id-and-revision) helper function
* Added [`isRevisionId`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#isrevisionid) helper function

## 6.5.0 - 2019-05-17
* Sitelink helpers: added support for wikimania sitelinks ([PR by @noinkling](https://github.com/maxlath/wikibase-sdk/pull/57))

## 6.4.0 - 2019-04-16
[`searchEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md): allow to set a value to the `continue` parameter

## 6.3.0 - 2019-04-11
* `simplify.claims`: Add support for `musical-notation` datatype

## 6.2.0 - 2019-04-03
* Allow to set the `redirects` parameter in [`getEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities#by-ids), [`getManyEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities#get-many-entities-by-id), and [`getEntitiesFromSitelinks`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-other-wikimedia-projects-titles) functions

## 6.1.0 - 2019-03-28
* Added Typescript types ([6d0ae70](https://github.com/maxlath/wikibase-sdk/commit/bb22a6897593b0041c159b12e2ed5fa681702074)), thanks **[@EdJoPaTo](https://github.com/EdJoPaTo)** and **[@noinkling](https://github.com/noinkling)**!
* Added new options to `simplify.claims`:
  * to deal with claims with special snaktypes:
    * [customize somevalue value](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#customize-somevalue-value)
    * [customize novalue value](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#customize-novalue-value)
    * [keep snaktypes](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-snaktypes)
  * to deal with ranks:
    * [keep ranks](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-ranks)
  * to activate all the `keep` options at once:
    * [keep all](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-all)

## 6.0.0 - 2019-03-17
**BREAKING CHANGE**
* swapping `simplify.qualifier` and `simplify.qualifiers` that were mistakenly inverted (fixed [#47](https://github.com/maxlath/wikibase-sdk/issues/47), [`ed0e7a4`](https://github.com/maxlath/wikibase-sdk/commit/ed0e7a4))
* Make [`simplifySparqlResults`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_sparql_results.md) consistently outputs an array of objects, unless the option `minimize` is set to `true`, in which case direct, requests with a single variable will return an array of those variables values (([ddba9e2](https://github.com/maxlath/wikibase-sdk/commit/ddba9e2))). The easy migration from `v5.x.x` is to replace `simplifySparqlResults(results)` by `simplifySparqlResults(results, { minimize: true })` (This doesn't affect requests with several variables `SELECT`ed)

## 5.16.0 - 2019-03-13
* [`searchEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md): accept a `type` parameter

## 5.15.0 - 2018-07-21
* [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities_reverse_claims.md): Added ability to query entities by multiple property values

## 5.14.0 - 2018-07-14
* Added [simplify.qualifier](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplifyqualifier), [simplify.propertyQualifiers](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplifypropertyqualifiers), [simplify.qualifiers](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplifyqualifiers) functions

## 5.13.0 - 2018-07-06
* Added [`isGuid`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#isguid) helper function
* Make [`simplifySparqlResults`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_sparql_results.md) format statement URIs as claims GUIDs

## 5.12.0 - 2018-06-27
* Added [`truthyClaims`](`https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#truthyclaims`) and [`truthyPropertyClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#truthyPropertyClaims) functions
* Added [`simplify.entities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-entities)

## 5.11.0 - 2018-05-19
* Added [`getImageUrl`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getimageurl) helper

## 5.10.0 - 2018-05-14
* Added new option to `simplify.claims`:
  * [keep types](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-types) (thanks **[@moshest](https://github.com/moshest)**!)

## 5.9.0 - 2018-02-26
* [`Wikidata Time converters`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#wikidata-time-converters) now also accept a time value object to take in account the precision, which only makes a difference in the result for [`wikidataTimeToSimpleDay`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#wikidataTimeToSimpleDay)

## 5.8.0 - 2018-01-27
* Added [`wikidataTimeToSimpleDay`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#wikidataTimeToSimpleDay)

## 5.7.0 - 2017-12-20
* [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities_reverse_claims.md): allow to request values for several properties at once

## 5.6.0 - 2017-12-14
* Added new sitelink helpers: [`getSitelinkData`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getsitelinkdata) and [`isSitelinkKey`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#issitelinkkey)

## 5.5.0 - 2017-12-04
* Added new options to `simplify.sitelinks`:
  * [add url](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#add-sitelinks-urls)
* Added new sitelink helper: [`getSitelinkUrl`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getsitelinkdata) and [`isSitelinkKey`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/general_helpers.md#getsitelinkurl)

## 5.4.0 - 2017-11-30
* Added a new option to `simplify.claims`:
  * [keep rich-values](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-rich-values)

## 5.3.0 - 2017-11-09
* Added new options to `simplify.claims`:
  * [keep references](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-references)
  * [keep ids](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-ids)
  * [keep hashes](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-hashes)

## 5.2.0 - 2017-06-10
* Added [`getRevisions`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_revisions.md)
* Added option `timeConverter` to [`simplify.claims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md) functions

## 5.1.0 - 2017-03-31
* Added [`simplify.entity`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-entity)
* Added [`simplify.labels`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-labels)
* Added [`simplify.descriptions`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-descriptions)
* Added [`simplify.aliases`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-aliases)
* Added [`simplify.sitelinks`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_entities_data.md#simplify-sitelinks)

## 5.0.0 - 2017-03-28
**Breaking Changes**:
* ([00e3c81](https://github.com/maxlath/wikibase-sdk/commit/00e3c81)) Fixed [naming issues](https://github.com/maxlath/wikibase-sdk/issues/15):
  * renamed `isWikidataId` => `isEntityId`
  * renamed `isWikidataEntityId` => `isItemId`
  * renamed `isWikidataPropertyId` => `isPropertyId`
* ([df4301a](https://github.com/maxlath/wikibase-sdk/commit/df4301a)) Removed helpers that were only needed to work with the now-offline WDQ service that is, all helpers dealing with entities ids in there numeric id form: `normalizeId`, `normalizeIds`, ~~`isNumericId`, `getNumericId`~~ (those last removal were reverted by ([2b5020e](https://github.com/maxlath/wikibase-sdk/commit/2b5020e)))
* ([a5ae25f](https://github.com/maxlath/wikibase-sdk/commit/a5ae25f)) Removed `normalizeWikidataTime` alias: use one of `wikidataTimeToDateObject`, `wikidataTimeToEpochTime`, `wikidataTimeToISOString` instead
* ([e2158f9](https://github.com/maxlath/wikibase-sdk/commit/e2158f9)) `simplifyClaims` functions now use `wikidataTimeToISOString` as time normalizer instead of `wikidataTimeToEpochTime`

## 4.3.0 - 2017-03-28
* Added `limit` and `caseInsensitive` options to [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities_reverse_claims.md)

## 4.2.0 - 2017-01-02
* Added the option to [keep qualifiers](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#keep-qualifiers) to `simplifyClaims` functions

## 4.1.0 - 2016-11-08
* [Simplify claims functions](https://github.com/maxlath/wikibase-sdk/blob/main/docs/#simplify-claims-results) now each accept a 2nd and 3rd optional arguments to [specify entity and property id prefixes](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#add-prefixes-to-entities-and-properties-ids)

## 4.0.0 - 2016-09-09
* Completly removed uses and references to wdq:
  * BREAKING CHANGE: [`getReverseClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/#get-entities-reverse-claims) now returns a query to the SPARQL endpoint. Its result should thus be parsed with [`simplifySparqlResults`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_sparql_results.md) instead of `wdk.parse.entities`. This parser was thus removed.

## 3.2.0 - 2016-06-06
* Added [`simplifySparqlResults`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_sparql_results.md) function

## 3.1.0 - 2016-06-02
* Added [`getManyEntities`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities#get-many-entities-by-id) function

## 3.0.0 - 2016-05-13
* Extracting "bin" executables (qlabel, wikiqid) to there own modules: [wikidata-cli](https://github.com/maxlath/wikidata-cli). Bumping the major version as it could be considered a breaking change (despite the fact that those executables weren't really part of wikibase-sdk and that they were added very recently)

## 2.6.0 - 2016-04-28
* Added [CLI tools](https://github.com/maxlath/wikibase-sdk/blob/main/docs/#cli): qlabel and wikiqid

## 2.5.0 - 2016-04-18
* Added support for the uselang parameter in entities search

## 2.4.0 - 2016-04-15
* Added [`simplifyClaim`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#simplifyclaim), [`simplifyPropertyClaims`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/simplify_claims.md#simplifypropertyclaims)

## 2.3.0 - 2016-02-17
* Added a SPARQL query url generator: [`sparqlQuery`](https://github.com/maxlath/wikibase-sdk/blob/main/docs/sparql_query.md)
