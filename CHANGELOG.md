# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 4.1.0 - 2016-11-08
* [Simplify claims functions](https://github.com/maxlath/wikidata-sdk#simplify-claims-results) now each accept a 2nd and 3rd optional arguments to [specify entity and property id prefixes](https://github.com/maxlath/wikidata-sdk#add-prefixes-to-entities-and-properties-ids)

## 4.0.0 - 2016-09-09
* Completly removed uses and references to wdq:
  * BREAKING CHANGE: [getReverseClaims](https://github.com/maxlath/wikidata-sdk#get-entities-reverse-claims) now returns a query to the SPARQL endpoint. Its result should thus be parsed with [`wdk.simplifySparqlResults`](https://github.com/maxlath/wikidata-sdk#simplify-sparql-results) instead of `wdk.parse.wdq.entities`. This parser was thus removed.

## 3.2.0 - 2016-06-06
* Added [wdk.simplifySparqlResults](https://github.com/maxlath/wikidata-sdk#simplify-sparql-results)

## 3.1.0 - 2016-06-02
* Added [wdk.getManyEntities](https://github.com/maxlath/wikidata-sdk#get-many-entities-by-id)

## 3.0.0 - 2016-05-13
* Extracting "bin" executables (qlabel, wikiqid) to there own modules: [wikidata-cli](https://npmjs.com/package/wikidata-cli). Bumping the major version as it could be considered a breaking change (despite the fact that those executables weren't really part of wikidata-sdk and that they were added very recently)

## 2.6.0 - 2016-04-28
* Added [CLI tools](https://github.com/maxlath/wikidata-sdk#cli): [qlabel](https://github.com/maxlath/wikidata-sdk#qlabel) and [wikiqid](https://github.com/maxlath/wikidata-sdk#wikiqid)

## 2.5.0 - 2016-04-18
* Added support for the uselang parameter in entities search

## 2.4.0 - 2016-04-15
* Added [wdk.simplifyClaim](https://github.com/maxlath/wikidata-sdk#simplifyclaim), [wdk.simplifyPropertyClaims](https://github.com/maxlath/wikidata-sdk#simplifypropertyclaims)

## 2.3.0 - 2016-02-17
* Added a SPARQL query url generator: [wdk.sparqlQuery](https://github.com/maxlath/wikidata-sdk#sparql-queries)
