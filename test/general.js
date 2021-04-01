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
    const wbk = WBK({ instance, sparqlEndpoint })
    wbk.searchEntities('ingmar Bergman').should.startWith(instance)
    wbk.getReverseClaims('P50', 'Q504').should.startWith(sparqlEndpoint)
  })

  it('should exposed sanitized instance URL', () => {
    const wbk = WBK({ instance, sparqlEndpoint })
    wbk.instance.root.should.equal(instance)
    wbk.instance.apiEndpoint.should.equal(`${instance}/w/api.php`)
  })
})

describe('index', () => {
  it('should give access to all the function', () => {
    const wbk = WBK({ instance, sparqlEndpoint })

    wbk.should.be.an.Object()

    wbk.searchEntities.should.be.a.Function()
    wbk.cirrusSearch.should.be.a.Function()
    wbk.getEntities.should.be.a.Function()
    wbk.getManyEntities.should.be.a.Function()
    wbk.getEntityRevision.should.be.a.Function()
    wbk.getReverseClaims.should.be.a.Function()
    wbk.getRevisions.should.be.a.Function()
    wbk.getEntitiesFromSitelinks.should.be.a.Function()

    wbk.simplify.should.be.a.Object()
    wbk.simplify.entity.should.be.a.Function()
    wbk.simplify.entities.should.be.a.Function()
    wbk.simplify.labels.should.be.a.Function()
    wbk.simplify.descriptions.should.be.a.Function()
    wbk.simplify.aliases.should.be.a.Function()
    wbk.simplify.sitelinks.should.be.a.Function()
    wbk.simplify.claim.should.be.a.Function()
    wbk.simplify.propertyClaims.should.be.a.Function()
    wbk.simplify.claims.should.be.a.Function()
    wbk.simplify.snak.should.be.a.Function()
    wbk.simplify.propertySnaks.should.be.a.Function()
    wbk.simplify.snaks.should.be.a.Function()
    wbk.simplify.qualifier.should.be.a.Function()
    wbk.simplify.propertyQualifiers.should.be.a.Function()
    wbk.simplify.qualifiers.should.be.a.Function()
    wbk.simplify.forms.should.be.a.Function()
    wbk.simplify.form.should.be.a.Function()
    wbk.simplify.senses.should.be.a.Function()
    wbk.simplify.sense.should.be.a.Function()
    wbk.simplify.sparqlResults.should.be.a.Function()
    wbk.truthyClaims.should.be.a.Function()
    wbk.truthyPropertyClaims.should.be.a.Function()

    wbk.parse.should.be.an.Object()

    wbk.parse.wb.should.be.an.Object()
    wbk.parse.wb.entities.should.be.an.Function()
    wbk.parse.wb.cirrusSearchTitles.should.be.an.Function()

    // Legacy
    wbk.parse.wd.should.be.an.Object()
    wbk.parse.wd.entities.should.be.an.Function()

    wbk.isEntityId.should.be.a.Function()
    wbk.isItemId.should.be.a.Function()
    wbk.isPropertyId.should.be.a.Function()
    wbk.isNumericId.should.be.a.Function()
    wbk.isGuid.should.be.a.Function()
    wbk.isHash.should.be.a.Function()
    wbk.isPropertyClaimsId.should.be.a.Function()
    wbk.getNumericId.should.be.a.Function()
    wbk.isEntityId.should.be.a.Function()
    wbk.isItemId.should.be.a.Function()
    wbk.isPropertyId.should.be.a.Function()
    wbk.wikibaseTimeToDateObject.should.be.a.Function()
    wbk.wikibaseTimeToEpochTime.should.be.a.Function()
    wbk.wikibaseTimeToISOString.should.be.a.Function()
    wbk.wikibaseTimeToSimpleDay.should.be.a.Function()
    wbk.getSitelinkUrl.should.be.a.Function()
    wbk.getSitelinkData.should.be.a.Function()
    wbk.isSitelinkKey.should.be.a.Function()
    wbk.getImageUrl.should.be.a.Function()
    wbk.getEntityIdFromGuid.should.be.a.Function()
  })
})
