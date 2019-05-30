require('should')
const wbkBuilder = require('../lib/index')
const { instance, sparqlEndpoint } = require('./lib/tests_env')

describe('builder', () => {
  it('should be a function', done => {
    wbkBuilder.should.be.a.Function()
    done()
  })

  it('should throw when initialized without a config', done => {
    wbkBuilder.should.throw()
    done()
  })

  it('should throw when initialized with an invalid instance', done => {
    (() => wbkBuilder({ instance: 'foo' })).should.throw('invalid instance: foo')
    done()
  })

  it('should throw when initialized with an invalid sparql endpoint', done => {
    (() => wbkBuilder({ instance, sparqlEndpoint: 'foo' })).should.throw('invalid sparqlEndpoint: foo')
    done()
  })
})

describe('index', () => {
  it('should give access to all the function', done => {
    const wdk = wbkBuilder({ instance, sparqlEndpoint })

    wdk.should.be.an.Object()

    wdk.searchEntities.should.be.a.Function()
    wdk.getEntities.should.be.a.Function()
    wdk.getManyEntities.should.be.a.Function()
    wdk.getEntityRevision.should.be.a.Function()
    wdk.getReverseClaims.should.be.a.Function()
    wdk.getRevisions.should.be.a.Function()
    wdk.getEntitiesFromSitelinks.should.be.a.Function()
    // Legacy
    wdk.getWikidataIdsFromSitelinks.should.be.a.Function()

    wdk.simplify.should.be.a.Object()
    wdk.simplify.entity.should.be.a.Function()
    wdk.simplify.entities.should.be.a.Function()
    wdk.simplify.labels.should.be.a.Function()
    wdk.simplify.descriptions.should.be.a.Function()
    wdk.simplify.aliases.should.be.a.Function()
    wdk.simplify.sitelinks.should.be.a.Function()
    wdk.simplify.claim.should.be.a.Function()
    wdk.simplify.propertyClaims.should.be.a.Function()
    wdk.simplify.claims.should.be.a.Function()
    wdk.simplify.qualifier.should.be.a.Function()
    wdk.simplify.propertyQualifiers.should.be.a.Function()
    wdk.simplify.qualifiers.should.be.a.Function()
    wdk.simplify.sparqlResults.should.be.a.Function()
    wdk.truthyClaims.should.be.a.Function()
    wdk.truthyPropertyClaims.should.be.a.Function()

    // Legacy
    wdk.simplifyClaim.should.be.a.Function()
    wdk.simplifyPropertyClaims.should.be.a.Function()
    wdk.simplifyClaims.should.be.a.Function()
    wdk.simplifySparqlResults.should.be.a.Function()

    wdk.parse.should.be.an.Object()
    wdk.parse.wd.should.be.an.Object()
    wdk.parse.wd.entities.should.be.an.Function()

    wdk.getWikidataIdsFromWikipediaTitles.should.be.a.Function()

    wdk.isEntityId.should.be.a.Function()
    wdk.isItemId.should.be.a.Function()
    wdk.isPropertyId.should.be.a.Function()
    wdk.isNumericId.should.be.a.Function()
    wdk.isGuid.should.be.a.Function()
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
    wdk.wikidataTimeToSimpleDay.should.be.a.Function()
    wdk.getSitelinkUrl.should.be.a.Function()
    wdk.getSitelinkData.should.be.a.Function()
    wdk.isSitelinkKey.should.be.a.Function()

    done()
  })
})
