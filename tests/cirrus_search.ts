import should from 'should'
import { cirrusSearchPagesFactory } from '../src/queries/cirrus_search.js'
import { buildUrl } from './lib/tests_env.js'
import { parseUrlQuery } from './lib/utils.js'

const cirrusSearchPages = cirrusSearchPagesFactory(buildUrl)

describe('cirrusSearchPages', () => {
  it('should generate a URL with the query/search endpoint', () => {
    const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
    query.action.should.equal('query')
    query.list.should.equal('search')
    query.srsearch.should.equal('hello')
    should(query.srlimit).not.be.ok()
    should(query.srnamespace).not.be.ok()
    should(query.sroffset).not.be.ok()
    should(query.srqiprofile).not.be.ok()
    should(query.srsort).not.be.ok()
  })

  it('should accept only the object interface', () => {
    cirrusSearchPages.bind(null, 'hello').should.throw()
  })

  describe('haswbstatement', () => {
    it('should accept a statement argument', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', haswbstatement: 'P31=Q5' }))
      query.srsearch.should.equal('hello haswbstatement:P31=Q5')
    })

    it('should accept a statement argument alone', () => {
      const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: 'P31=Q5' }))
      query.srsearch.should.equal('haswbstatement:P31=Q5')
    })

    it('should accept an array of statements', () => {
      const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: [ 'P31=Q5', 'P279=Q2934' ] }))
      query.srsearch.should.equal('haswbstatement:P31=Q5 haswbstatement:P279=Q2934')
    })

    it('should accept negative statements', () => {
      const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: '-P31=Q5' }))
      query.srsearch.should.equal('-haswbstatement:P31=Q5')
      const query2 = parseUrlQuery(cirrusSearchPages({ haswbstatement: [ 'P31=Q5', '-P279=Q2934' ] }))
      query2.srsearch.should.equal('haswbstatement:P31=Q5 -haswbstatement:P279=Q2934')
    })
  })

  describe('format', () => {
    it('should default to json', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      query.format.should.equal('json')
    })

    it('should accept a custom format', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', format: 'xml' }))
      query.format.should.equal('xml')
    })
  })

  describe('namespace', () => {
    it('should default to not being set', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      should(query.srnamespace).not.be.ok()
    })

    it('should accept a single namespace number', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: 0 }))
      query.srnamespace.should.equal('0')
    })

    it('should accept a single namespace string', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: '0' }))
      query.srnamespace.should.equal('0')
    })

    it('should accept multiple namespaces as a string', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: '0|1' }))
      query.srnamespace.should.equal('0|1')
    })

    it('should accept multiple namespaces as an array', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: [ 0, 1 ] }))
      query.srnamespace.should.equal('0|1')
    })

    it('should reject an invalid namespace', () => {
      cirrusSearchPages.bind(null, { search: 'hello', namespace: 'foo' }).should.throw(/invalid namespace/)
    })
  })

  describe('limit', () => {
    it('should default to not being set', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      should(query.srlimit).not.be.ok()
    })

    it('should accept a custom limit', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', limit: 10 }))
      query.srlimit.should.equal('10')
    })

    it('should reject an invalid limit', () => {
      cirrusSearchPages.bind(null, { search: 'hello', limit: 'foo' }).should.throw(/invalid limit/)
    })
  })

  describe('offset', () => {
    it('should default to not being set', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      should(query.sroffset).not.be.ok()
    })

    it('should accept a custom offset', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', offset: 10 }))
      query.sroffset.should.equal('10')
    })

    it('should reject an invalid offset', () => {
      cirrusSearchPages.bind(null, { search: 'hello', offset: 'foo' }).should.throw(/invalid offset/)
    })
  })

  describe('profile', () => {
    it('should default to not being set', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      should(query.srqiprofile).not.be.ok()
    })

    it('should accept a profile', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', profile: 'wikibase_prefix_boost' }))
      query.srqiprofile.should.equal('wikibase_prefix_boost')
    })

    it('should reject an invalid profile', () => {
      cirrusSearchPages.bind(null, { search: 'hello', profile: 123 }).should.throw(/invalid profile/)
    })
  })

  describe('sort', () => {
    it('should default to not being set', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }))
      should(query.srsort).not.be.ok()
    })

    it('should accept a sort', () => {
      const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', sort: 'last_edit_desc' }))
      query.srsort.should.equal('last_edit_desc')
    })

    it('should reject an invalid sort', () => {
      cirrusSearchPages.bind(null, { search: 'hello', sort: 123 }).should.throw(/invalid sort/)
    })
  })
})
