# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 5.2.0 - 2017-03-31
* Added option `timeConverter` to [`simplify.claims`](docs/simplify_claims.md) functions

## 5.1.0 - 2017-03-31
* Added [`simplify.entity`](https://github.com/maxlath/wikidata-sdk/blob/master/simplify_entities_data.md#simplify-entity)
* Added [`simplify.labels`](https://github.com/maxlath/wikidata-sdk/blob/master/simplify_entities_data.md#simplify-labels)
* Added [`simplify.descriptions`](https://github.com/maxlath/wikidata-sdk/blob/master/simplify_entities_data.md#simplify-descriptions)
* Added [`simplify.aliases`](https://github.com/maxlath/wikidata-sdk/blob/master/simplify_entities_data.md#simplify-aliases)
* Added [`simplify.sitelinks`](https://github.com/maxlath/wikidata-sdk/blob/master/simplify_entities_data.md#simplify-sitelinks)

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
* Added the option to [keep qualifiers](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_claims.md#keep-qualifiers) to simplifyClaims functions

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
