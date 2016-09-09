should = require 'should'
wdk = require '../src/wikidata-sdk'

describe 'general', ->
  it 'env', (done)->
    wdk.should.be.an.Object()
    { parse, helpers } = wdk

    wdk.searchEntities.should.be.a.Function()
    wdk.getEntities.should.be.a.Function()
    wdk.getManyEntities.should.be.a.Function()
    wdk.getWikidataIdsFromSitelinks.should.be.a.Function()
    wdk.getReverseClaims.should.be.a.Function()

    wdk.simplifyClaim.should.be.a.Function()
    wdk.simplifyPropertyClaims.should.be.a.Function()
    wdk.simplifyClaims.should.be.a.Function()

    wdk.simplifySparqlResults.should.be.a.Function()

    parse.should.be.an.Object()
    parse.wd.should.be.an.Object()
    parse.wd.entities.should.be.an.Function()

    wdk.getWikidataIdsFromWikipediaTitles.should.be.a.Function()

    helpers.should.be.an.Object()
    helpers.isNumericId.should.be.a.Function()
    helpers.isWikidataId.should.be.a.Function()
    helpers.isWikidataEntityId.should.be.a.Function()
    helpers.isWikidataPropertyId.should.be.a.Function()
    helpers.normalizeId.should.be.a.Function()
    helpers.getNumericId.should.be.a.Function()
    helpers.normalizeIds.should.be.a.Function()
    helpers.wikidataTimeToDateObject.should.be.a.Function()
    helpers.wikidataTimeToEpochTime.should.be.a.Function()
    helpers.wikidataTimeToISOString.should.be.a.Function()
    helpers.normalizeWikidataTime.should.be.a.Function()

    wdk.isNumericId.should.be.a.Function()
    wdk.isWikidataId.should.be.a.Function()
    wdk.isWikidataEntityId.should.be.a.Function()
    wdk.isWikidataPropertyId.should.be.a.Function()
    wdk.normalizeId.should.be.a.Function()
    wdk.getNumericId.should.be.a.Function()
    wdk.normalizeIds.should.be.a.Function()
    wdk.wikidataTimeToDateObject.should.be.a.Function()
    wdk.wikidataTimeToEpochTime.should.be.a.Function()
    wdk.wikidataTimeToISOString.should.be.a.Function()
    wdk.normalizeWikidataTime.should.be.a.Function()
    done()

