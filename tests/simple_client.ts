import should from 'should'
import { WBK } from '../src/wikibase-sdk.js'
import type { ItemId } from '../src/index.js'

const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
  userAgent: 'wikibase-sdk-tests/integration',
})

const wdkWithOptions = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
  userAgent: 'wikibase-sdk-tests/integration',
  simplifyEntityOptions: { keepQualifiers: true },
})

describe('simpleClient (integration)', function () {
  // Network requests — give each test up to 10 seconds
  this.timeout(10_000)

  describe('getEntities', () => {
    it('fetches entities in batches and returns merged simplified entities', async () => {
      const ids = [ 'Q135519449', 'Q135519450', 'Q135519451' ] as ItemId[]
      const res = await wdk.simpleClient.getEntities({ ids })
      should(res).be.an.Object()
      const entity = res['Q135519449']
      should(entity?.id).equal('Q135519449')
      // labels are simplified: { en: 'some label' } not { en: { language, value } }
      if (entity && 'labels' in entity && entity.labels) {
        const firstLabel = Object.values(entity.labels)[0]
        should(firstLabel).be.a.String()
      }
    })
  })

  describe('searchEntities', () => {
    it('returns a search response with results', async () => {
      const res = await wdk.simpleClient.searchEntities({ search: 'Douglas Adams', language: 'en', limit: 3 })
      should(res).be.an.Array()
      should(res.length).be.above(0)
      should(res[0]).have.property('id')
      should(res[0]).have.property('label')
    })
  })

  describe('cirrusSearchPages', () => {
    it('returns an array of page title strings', async () => {
      const res = await wdk.simpleClient.cirrusSearchPages({ haswbstatement: 'P31=Q5', limit: 3 })
      should(res).be.an.Array()
      should(res.length).be.above(0)
      should(res[0]).be.a.String()
    })
  })

  describe('getRevisions', () => {
    it('returns revision data for an entity', async () => {
      const res = await wdk.simpleClient.getRevisions({ ids: 'Q135519449', limit: 2 })
      should(res).be.an.Object()
      should(res).be.an.Object()
      const pages = Object.values(res)
      should(pages.length).be.above(0)
      should(pages[0]?.revisions).be.an.Array()
    })
  })

  describe('getEntityRevision', () => {
    it('fetches a specific revision and returns simplified entities', async () => {
      const revisionsRes = await wdk.simpleClient.getRevisions({ ids: 'Q135519449', limit: 1 })
      const page = Object.values(revisionsRes)[0]
      const revid = page?.revisions[0]?.revid
      should(revid).be.a.Number()

      const entity = await wdk.simpleClient.getEntityRevision({ id: 'Q135519449', revision: `${revid}` })
      should(entity).be.an.Object()
      should(entity?.id).equal('Q135519449')
    })
  })

  describe('getEntitiesFromSitelinks', () => {
    it('looks up entities from Wikipedia page titles and returns simplified data', async () => {
      const res = await wdk.simpleClient.getEntitiesFromSitelinks({
        titles: 'Douglas Adams',
        sites: 'enwiki',
        languages: 'en',
      })
      should(res).be.an.Object()
      const entities = Object.values(res)
      should(entities.length).be.above(0)
      should(entities[0]?.id).be.a.String()
    })
  })

  describe('sparqlQuery', () => {
    it('executes a SPARQL query and returns simplified results', async () => {
      const sparql = 'SELECT ?item WHERE { wd:Q135519449 wdt:P31 ?item } LIMIT 3'
      const res = await wdk.simpleClient.sparqlQuery(sparql)
      should(res).be.an.Array()
      should(res.length).be.above(0)
      // simplified: entity URIs are converted to IDs like 'Q5'
      should(res[0]).have.property('item')
      should(res[0]?.item).be.a.String()
    })
  })

  describe('getReverseClaims', () => {
    it('returns simplified SPARQL results for a property-value pair', async () => {
      const res = await wdk.simpleClient.getReverseClaims({ properties: 'P31', values: 'Q5', limit: 3 })
      should(res).be.an.Array()
      should(res.length).be.above(0)
      should(res[0]).have.property('subject')
      // simplified: URI converted to entity ID string
      should(res[0]?.subject).be.a.String()
    })
  })
})

describe('simpleClient with simplifyEntityOptions (integration)', function () {
  this.timeout(10_000)

  describe('simplifyEntityOptions', () => {
    it('passes keepQualifiers option through to simplifyEntities', async () => {
      // Q2 (Earth) has claims with qualifiers
      const withoutQualifiers = await wdk.simpleClient.getEntities({ ids: [ 'Q2' ] as ItemId[] })
      const withQualifiers = await wdkWithOptions.simpleClient.getEntities({ ids: [ 'Q2' ] as ItemId[] })

      const entityWithout = withoutQualifiers['Q2']
      const entityWith = withQualifiers['Q2']

      should(entityWithout).be.an.Object()
      should(entityWith).be.an.Object()

      // Both Q2 results are items — narrow via type guard so TS sees `.claims`
      if (!entityWithout || !('claims' in entityWithout) || !entityWith || !('claims' in entityWith)) return

      const claimsWithout = entityWithout.claims ?? {}
      const claimsWith = entityWith.claims ?? {}

      // With keepQualifiers, claim values are objects with a `qualifiers` key
      const firstPropertyWith = Object.values(claimsWith)[0] as unknown[]
      should(firstPropertyWith).be.an.Array()
      if (firstPropertyWith && firstPropertyWith.length > 0) {
        should(firstPropertyWith[0]).be.an.Object()
        should(firstPropertyWith[0]).have.property('qualifiers')
      }

      // Without keepQualifiers, claim values are plain strings/numbers/objects without `qualifiers`
      const firstPropertyWithout = Object.values(claimsWithout)[0] as unknown[]
      should(firstPropertyWithout).be.an.Array()
      if (firstPropertyWithout && firstPropertyWithout.length > 0) {
        should(firstPropertyWithout[0]).not.have.property('qualifiers')
      }
    })
  })
})
