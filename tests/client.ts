import should from 'should'
import { WBK } from '../src/wikibase-sdk.js'

const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
}, {
  headers: { 'User-Agent': 'wikibase-sdk-tests/integration' },
})

describe('client (integration)', function () {
  // Network requests — give each test up to 10 seconds
  this.timeout(10_000)

  describe('getEntities', () => {
    it('fetches a single entity and returns well-formed data', async () => {
      const res = await wdk.client.getEntities({ ids: 'Q1' })
      should(res).be.an.Object()
      should(res.entities).be.an.Object()
      should(res.entities['Q1']).be.an.Object()
      should(res.entities['Q1']?.id).equal('Q1')
    })
  })

  describe('getManyEntities', () => {
    it('fetches entities in batches and returns an array of responses', async () => {
      const ids = Array.from({ length: 3 }, (_, i) => `Q${i + 1}`) as [`Q${number}`, ...`Q${number}`[]]
      const responses = await wdk.client.getManyEntities({ ids })
      should(responses).be.an.Array()
      should(responses.length).equal(1)
      const res = responses[0]
      should(res).be.an.Object()
      should(res?.entities).be.an.Object()
    })
  })

  describe('searchEntities', () => {
    it('returns a search response with results', async () => {
      const res = await wdk.client.searchEntities({ search: 'Douglas Adams', language: 'en', limit: 3 })
      should(res).be.an.Object()
      should(res.search).be.an.Array()
      should(res.search.length).be.above(0)
      should(res.search[0]).have.property('id')
      should(res.search[0]).have.property('label')
    })
  })

  describe('cirrusSearchPages', () => {
    it('returns pages matching a haswbstatement filter', async () => {
      const res = await wdk.client.cirrusSearchPages({ haswbstatement: 'P31=Q5', limit: 3 })
      should(res).be.an.Object()
      should(res.query.search).be.an.Array()
      should(res.query.search.length).be.above(0)
      should(res.query.search[0]).have.property('title')
    })
  })

  describe('getRevisions', () => {
    it('returns revision data for an entity', async () => {
      const res = await wdk.client.getRevisions({ ids: 'Q1', limit: 2 })
      should(res).be.an.Object()
      should(res.query.pages).be.an.Object()
      const pages = Object.values(res.query.pages)
      should(pages.length).be.above(0)
      should(pages[0]?.revisions).be.an.Array()
    })
  })

  describe('getEntityRevision', () => {
    it('fetches a specific revision of an entity', async () => {
      const revisionsRes = await wdk.client.getRevisions({ ids: 'Q1', limit: 1 })
      const page = Object.values(revisionsRes.query.pages)[0]
      const revid = page?.revisions[0]?.revid
      should(revid).be.a.Number()

      const res = await wdk.client.getEntityRevision({ id: 'Q1', revision: `${revid}` })
      should(res).be.an.Object()
      should(res.entities).be.an.Object()
      should(res.entities['Q1']).be.an.Object()
      should(res.entities['Q1']?.id).equal('Q1')
    })
  })

  describe('getEntitiesFromSitelinks', () => {
    it('looks up entities from Wikipedia page titles', async () => {
      const res = await wdk.client.getEntitiesFromSitelinks({
        titles: 'Douglas Adams',
        sites: 'enwiki',
        languages: 'en',
      })
      should(res).be.an.Object()
      should(res.entities).be.an.Object()
      const entities = Object.values(res.entities)
      should(entities.length).be.above(0)
    })
  })

  describe('sparqlQuery', () => {
    it('executes a SPARQL query and returns bindings', async () => {
      const sparql = 'SELECT ?item WHERE { wd:Q1 wdt:P31 ?item } LIMIT 3'
      const res = await wdk.client.sparqlQuery(sparql)
      should(res).be.an.Object()
      should(res.results).be.an.Object()
      should(res.results.bindings).be.an.Array()
    })
  })

  describe('getReverseClaims', () => {
    it('returns subjects with a given property-value pair', async () => {
      const res = await wdk.client.getReverseClaims({ properties: 'P31', values: 'Q5', limit: 3 })
      should(res).be.an.Object()
      should(res.results.bindings).be.an.Array()
      should(res.results.bindings.length).be.above(0)
      should(res.results.bindings[0]).have.property('subject')
    })
  })
})
