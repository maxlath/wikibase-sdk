require('should')
const wdk = require('../lib/index')

describe('general', function () {
  it('env', function (done) {
    wdk.should.be.an.Object()
    const { parse } = wdk

    wdk.searchEntities.should.be.a.Function()
    wdk.getEntities.should.be.a.Function()
    wdk.getManyEntities.should.be.a.Function()
    wdk.getWikidataIdsFromSitelinks.should.be.a.Function()
    wdk.getReverseClaims.should.be.a.Function()

    wdk.simplify.should.be.a.Object()
    wdk.simplify.entity.should.be.a.Function()
    wdk.simplify.labels.should.be.a.Function()
    wdk.simplify.descriptions.should.be.a.Function()
    wdk.simplify.aliases.should.be.a.Function()
    wdk.simplify.sitelinks.should.be.a.Function()
    wdk.simplify.claim.should.be.a.Function()
    wdk.simplify.propertyClaims.should.be.a.Function()
    wdk.simplify.claims.should.be.a.Function()
    wdk.simplify.sparqlResults.should.be.a.Function()

    // Legacy
    wdk.simplifyClaim.should.be.a.Function()
    wdk.simplifyPropertyClaims.should.be.a.Function()
    wdk.simplifyClaims.should.be.a.Function()
    wdk.simplifySparqlResults.should.be.a.Function()

    parse.should.be.an.Object()
    parse.wd.should.be.an.Object()
    parse.wd.entities.should.be.an.Function()

    wdk.getWikidataIdsFromWikipediaTitles.should.be.a.Function()

    wdk.isEntityId.should.be.a.Function()
    wdk.isItemId.should.be.a.Function()
    wdk.isPropertyId.should.be.a.Function()
    wdk.isNumericId.should.be.a.Function()
    wdk.getNumericId.should.be.a.Function()
    wdk.wikidataTimeToDateObject.should.be.a.Function()
    wdk.wikidataTimeToEpochTime.should.be.a.Function()
    wdk.wikidataTimeToISOString.should.be.a.Function()

    wdk.isEntityId.should.be.a.Function()
    wdk.isItemId.should.be.a.Function()
    wdk.isPropertyId.should.be.a.Function()
    wdk.wikidataTimeToDateObject.should.be.a.Function()
    wdk.wikidataTimeToEpochTime.should.be.a.Function()
    wdk.wikidataTimeToISOString.should.be.a.Function()
    done()
  })
})
