import should from 'should'
import defaultWBK, { WBK, simplify, parse, isEntityId, getSitelinkData, simplifySparqlResults } from '../src/index.js'
import { instance, sparqlEndpoint } from './lib/tests_env.js'

describe('builder', () => {
  it('should be a function', () => {
    should(defaultWBK).be.a.Function()
    should(WBK).be.a.Function()
    should(defaultWBK).equal(WBK)
  })

  it('should reference instance-independant helpers', () => {
    should(parse).be.an.Object()
    should(simplify).be.an.Object()
    should(parse.entities).be.a.Function()
    should(simplify.labels).be.a.Function()
    should(simplifySparqlResults).be.a.Function()
    should(isEntityId).be.a.Function()
    should(getSitelinkData).be.a.Function()
  })

  it('should throw when initialized without a config', () => {
    // @ts-expect-error missing argument
    should(() => WBK()).throw()
  })

  it('should throw when initialized without an instance or a sparqlEndpoint', () => {
    should(() => WBK({})).throw()
  })

  it('should throw when initialized with an invalid instance', () => {
    should(() => WBK({ instance: 'foo' })).throw('invalid instance: foo')
  })

  it('should throw when initialized with an invalid sparql endpoint', () => {
    should(() => WBK({ instance, sparqlEndpoint: 'foo' })).throw('invalid sparqlEndpoint: foo')
  })

  it('should not throw when initialized without a sparql endpoint', () => {
    const wbk = WBK({ instance })
    // @ts-expect-error missing argument
    should(() => wbk.sparqlQuery()).throw('sparqlQuery requires a sparqlEndpoint to be set at initialization')
    // @ts-expect-error missing argument
    should(() => wbk.getReverseClaims()).throw('getReverseClaims requires a sparqlEndpoint to be set at initialization')
  })

  it('should not throw when initialized without a sparql endpoint', () => {
    const wbk = WBK({ sparqlEndpoint })
    // @ts-expect-error missing argument
    should(() => wbk.searchEntities()).throw('searchEntities requires an instance to be set at initialization')
    // @ts-expect-error missing argument
    should(() => wbk.getEntities()).throw('getEntities requires an instance to be set at initialization')
  })

  it('should produce valid URLs', () => {
    const wbk = WBK({ instance, sparqlEndpoint })
    should(wbk.searchEntities({ search: 'ingmar Bergman' })).startWith(instance)
    should(wbk.getReverseClaims({ properties: 'P50', values: 'Q504' })).startWith(sparqlEndpoint)
  })

  it('should exposed sanitized instance URL', () => {
    const wbk = WBK({ instance, sparqlEndpoint })
    should(wbk.instance.root).equal(instance)
    should(wbk.instance.apiEndpoint).equal(`${instance}/w/api.php`)
  })

  it('should allow to customize the script path', () => {
    should(WBK({ instance, wgScriptPath: 'foo' }).instance.apiEndpoint).equal(`${instance}/foo/api.php`)
    should(WBK({ instance, wgScriptPath: '/foo' }).instance.apiEndpoint).equal(`${instance}/foo/api.php`)
  })
})

describe('index', () => {
  it('should give access to all the function', () => {
    const wbk = WBK({ instance, sparqlEndpoint })

    should(wbk).be.an.Object()

    should(wbk.searchEntities).be.a.Function()
    should(wbk.cirrusSearchPages).be.a.Function()
    should(wbk.getEntities).be.a.Function()
    should(wbk.getManyEntities).be.a.Function()
    should(wbk.getEntityRevision).be.a.Function()
    should(wbk.getReverseClaims).be.a.Function()
    should(wbk.getRevisions).be.a.Function()
    should(wbk.getEntitiesFromSitelinks).be.a.Function()

    should(wbk.simplify.entity).be.a.Function()
    should(wbk.simplify.entities).be.a.Function()
    should(wbk.simplify.labels).be.a.Function()
    should(wbk.simplify.descriptions).be.a.Function()
    should(wbk.simplify.aliases).be.a.Function()
    should(wbk.simplify.sitelinks).be.a.Function()
    should(wbk.simplify.claim).be.a.Function()
    should(wbk.simplify.propertyClaims).be.a.Function()
    should(wbk.simplify.claims).be.a.Function()
    should(wbk.simplify.snak).be.a.Function()
    should(wbk.simplify.propertySnaks).be.a.Function()
    should(wbk.simplify.snaks).be.a.Function()
    should(wbk.simplify.qualifier).be.a.Function()
    should(wbk.simplify.propertyQualifiers).be.a.Function()
    should(wbk.simplify.qualifiers).be.a.Function()
    should(wbk.simplify.forms).be.a.Function()
    should(wbk.simplify.form).be.a.Function()
    should(wbk.simplify.senses).be.a.Function()
    should(wbk.simplify.sense).be.a.Function()
    should(wbk.simplify.sparqlResults).be.a.Function()
    should(wbk.truthyClaims).be.a.Function()
    should(wbk.truthyPropertyClaims).be.a.Function()

    should(wbk.parse.entities).be.a.Function()

    should(wbk.parse.entities).be.a.Function()
    should(wbk.parse.pagesTitles).be.a.Function()

    should(wbk.isEntityId).be.a.Function()
    should(wbk.isItemId).be.a.Function()
    should(wbk.isPropertyId).be.a.Function()
    should(wbk.isNumericId).be.a.Function()
    should(wbk.isGuid).be.a.Function()
    should(wbk.isHash).be.a.Function()
    should(wbk.isPropertyClaimsId).be.a.Function()
    should(wbk.getNumericId).be.a.Function()
    should(wbk.isEntityId).be.a.Function()
    should(wbk.isItemId).be.a.Function()
    should(wbk.isPropertyId).be.a.Function()
    should(wbk.wikibaseTimeToDateObject).be.a.Function()
    should(wbk.wikibaseTimeToEpochTime).be.a.Function()
    should(wbk.wikibaseTimeToISOString).be.a.Function()
    should(wbk.wikibaseTimeToSimpleDay).be.a.Function()
    should(wbk.getSitelinkUrl).be.a.Function()
    should(wbk.getSitelinkData).be.a.Function()
    should(wbk.isSitelinkKey).be.a.Function()
    should(wbk.getImageUrl).be.a.Function()
    should(wbk.getEntityIdFromGuid).be.a.Function()
  })
})
