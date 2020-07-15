require('should')
const WBK = require('../lib/wikibase-sdk')
const { instance, sparqlEndpoint } = require('./lib/tests_env')

describe('builder', () => {
  it('should be a function', () => {
    WBK.should.be.a.Function()
  })

  it('should reference instance-independant helpers', () => {
    WBK.parse.should.be.an.Object()
    WBK.simplify.should.be.an.Object()
    WBK.isEntityId.should.be.a.Function()
    WBK.getSitelinkData.should.be.a.Function()
  })

  it('should throw when initialized without a config', () => {
    WBK.should.throw()
  })

  it('should throw when initialized without an instance or a sparqlEndpoint', () => {
    (() => WBK({})).should.throw()
  })

  it('should throw when initialized with an invalid instance', () => {
    (() => WBK({ instance: 'foo' })).should.throw('invalid instance: foo')
  })

  it('should throw when initialized with an invalid sparql endpoint', () => {
    (() => WBK({ instance, sparqlEndpoint: 'foo' })).should.throw('invalid sparqlEndpoint: foo')
  })

  it('should not throw when initialized without a sparql endpoint', () => {
    const wbk = WBK({ instance })
    wbk.sparqlQuery.should.throw('sparqlQuery requires a sparqlEndpoint to be set at initialization')
    wbk.getReverseClaims.should.throw('getReverseClaims requires a sparqlEndpoint to be set at initialization')
  })

  it('should not throw when initialized without a sparql endpoint', () => {
    const wbk = WBK({ sparqlEndpoint })
    wbk.searchEntities.should.throw('searchEntities requires an instance to be set at initialization')
    wbk.getEntities.should.throw('getEntities requires an instance to be set at initialization')
  })

  it('should produce valid URLs', () => {
    const wdk = WBK({ instance, sparqlEndpoint })
    wdk.searchEntities('ingmar Bergman').should.startWith(instance)
    wdk.getReverseClaims('P50', 'Q504').should.startWith(sparqlEndpoint)
  })

  it('should exposed sanitized instance URL', () => {
    const wdk = WBK({ instance, sparqlEndpoint })
    wdk.instance.root.should.equal(instance)
    wdk.instance.apiEndpoint.should.equal(`${instance}/w/api.php`)
  })
})

describe('index', () => {
  it('should give access to all the function', () => {
    const wdk = WBK({ instance, sparqlEndpoint })

    wdk.should.be.an.Object()

    wdk.searchEntities.should.be.a.Function()
    wdk.getEntities.should.be.a.Function()
    wdk.getManyEntities.should.be.a.Function()
    wdk.getEntityRevision.should.be.a.Function()
    wdk.getReverseClaims.should.be.a.Function()
    wdk.getRevisions.should.be.a.Function()
    wdk.getEntitiesFromSitelinks.should.be.a.Function()

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
    wdk.simplify.forms.should.be.a.Function()
    wdk.simplify.form.should.be.a.Function()
    wdk.simplify.senses.should.be.a.Function()
    wdk.simplify.sense.should.be.a.Function()
    wdk.simplify.sparqlResults.should.be.a.Function()
    wdk.truthyClaims.should.be.a.Function()
    wdk.truthyPropertyClaims.should.be.a.Function()

    wdk.parse.should.be.an.Object()
    wdk.parse.wd.should.be.an.Object()
    wdk.parse.wd.entities.should.be.an.Function()

    wdk.isEntityId.should.be.a.Function()
    wdk.isItemId.should.be.a.Function()
    wdk.isPropertyId.should.be.a.Function()
    wdk.isNumericId.should.be.a.Function()
    wdk.isGuid.should.be.a.Function()
    wdk.isHash.should.be.a.Function()
    wdk.isPropertyClaimsId.should.be.a.Function()
    wdk.getNumericId.should.be.a.Function()
    wdk.isEntityId.should.be.a.Function()
    wdk.isItemId.should.be.a.Function()
    wdk.isPropertyId.should.be.a.Function()
    wdk.wikibaseTimeToDateObject.should.be.a.Function()
    wdk.wikibaseTimeToEpochTime.should.be.a.Function()
    wdk.wikibaseTimeToISOString.should.be.a.Function()
    wdk.wikibaseTimeToSimpleDay.should.be.a.Function()
    wdk.getSitelinkUrl.should.be.a.Function()
    wdk.getSitelinkData.should.be.a.Function()
    wdk.isSitelinkKey.should.be.a.Function()
    wdk.getImageUrl.should.be.a.Function()
    wdk.getEntityIdFromGuid.should.be.a.Function()
  })
})
