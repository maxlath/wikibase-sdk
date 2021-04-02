const should = require('should')

const { buildUrl } = require('./lib/tests_env')
const cirrusSearchPages = require('../lib/queries/cirrus_search')(buildUrl)

describe('cirrusSearchPages', () => {
  it('should generate a URL with the query/search endpoint', () => {
    const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
    searchParams.get('action').should.equal('query')
    searchParams.get('list').should.equal('search')
    searchParams.get('srsearch').should.equal('hello')
  })

  it('should accept only the object interface', () => {
    cirrusSearchPages.bind(null, 'hello').should.throw()
  })

  describe('statement', () => {
    it('should accept a statement argument', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', haswbstatement: 'P31=Q5' }))
      searchParams.get('srsearch').should.equal('hello haswbstatement:P31=Q5')
    })

    it('should accept a statement argument alone', () => {
      const { searchParams } = new URL(cirrusSearchPages({ haswbstatement: 'P31=Q5' }))
      searchParams.get('srsearch').should.equal('haswbstatement:P31=Q5')
    })

    it('should accept an array of statements', () => {
      const { searchParams } = new URL(cirrusSearchPages({ haswbstatement: [ 'P31=Q5', 'P279=Q2934' ] }))
      searchParams.get('srsearch').should.equal('haswbstatement:P31=Q5 haswbstatement:P279=Q2934')
    })
  })

  describe('format', () => {
    it('should default to json', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      searchParams.get('format').should.equal('json')
    })

    it('should accept a custom format', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', format: 'xml' }))
      searchParams.get('format').should.equal('xml')
    })
  })

  describe('namespace', () => {
    it('should default to not being set', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      should(searchParams.get('srnamespace')).not.be.ok()
    })

    it('should accept a single namespace number', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', namespace: 0 }))
      searchParams.get('srnamespace').should.equal('0')
    })

    it('should accept a single namespace string', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', namespace: '0' }))
      searchParams.get('srnamespace').should.equal('0')
    })

    it('should accept multiple namespaces as a string', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', namespace: '0|1' }))
      searchParams.get('srnamespace').should.equal('0|1')
    })

    it('should accept multiple namespaces as an array', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', namespace: [ 0, 1 ] }))
      searchParams.get('srnamespace').should.equal('0|1')
    })

    it('should reject an invalid namespace', () => {
      cirrusSearchPages.bind(null, { search: 'hello', namespace: 'foo' }).should.throw(/invalid namespace/)
    })
  })

  describe('limit', () => {
    it('should default to not being set', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      should(searchParams.get('srlimit')).not.be.ok()
    })

    it('should accept a custom limit', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', limit: 10 }))
      searchParams.get('srlimit').should.equal('10')
    })

    it('should reject an invalid limit', () => {
      cirrusSearchPages.bind(null, { search: 'hello', limit: 'foo' }).should.throw(/invalid limit/)
    })
  })

  describe('offset', () => {
    it('should default to not being set', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      should(searchParams.get('sroffset')).not.be.ok()
    })

    it('should accept a custom offset', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', offset: 10 }))
      searchParams.get('sroffset').should.equal('10')
    })

    it('should reject an invalid offset', () => {
      cirrusSearchPages.bind(null, { search: 'hello', offset: 'foo' }).should.throw(/invalid offset/)
    })
  })

  describe('profile', () => {
    it('should default to not being set', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      should(searchParams.get('srqiprofile')).not.be.ok()
    })

    it('should accept a profile', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', profile: 'wikibase_prefix_boost' }))
      searchParams.get('srqiprofile').should.equal('wikibase_prefix_boost')
    })

    it('should reject an invalid profile', () => {
      cirrusSearchPages.bind(null, { search: 'hello', profile: 123 }).should.throw(/invalid profile/)
    })
  })

  describe('sort', () => {
    it('should default to not being set', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello' }))
      should(searchParams.get('srsort')).not.be.ok()
    })

    it('should accept a sort', () => {
      const { searchParams } = new URL(cirrusSearchPages({ search: 'hello', sort: 'last_edit_desc' }))
      searchParams.get('srsort').should.equal('last_edit_desc')
    })

    it('should reject an invalid sort', () => {
      cirrusSearchPages.bind(null, { search: 'hello', sort: 123 }).should.throw(/invalid sort/)
    })
  })
})
