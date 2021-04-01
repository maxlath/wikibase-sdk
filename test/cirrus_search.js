require('should')

const { buildUrl } = require('./lib/tests_env')
const cirrusSearch = require('../lib/queries/cirrus_search')(buildUrl)

describe('cirrusSearch', () => {
  it('should generate a URL with the alternative endpoint', () => {
    const { searchParams } = new URL(cirrusSearch({ search: 'hello' }))
    searchParams.get('action').should.equal('query')
    searchParams.get('list').should.equal('search')
    searchParams.get('srsearch').should.equal('hello')
  })

  it('should accept a statement argument', () => {
    const { searchParams } = new URL(cirrusSearch({ search: 'hello', statement: 'P31=Q5' }))
    searchParams.get('srsearch').should.equal('hello haswbstatement:P31=Q5')
  })

  it('should accept a statement argument alone', () => {
    const { searchParams } = new URL(cirrusSearch({ statement: 'P31=Q5' }))
    searchParams.get('srsearch').should.equal('haswbstatement:P31=Q5')
  })

  it('should accept an array of statements', () => {
    const { searchParams } = new URL(cirrusSearch({ statement: [ 'P31=Q5', 'P279=Q2934' ] }))
    searchParams.get('srsearch').should.equal('haswbstatement:P31=Q5 haswbstatement:P279=Q2934')
  })

  it('should accept only the object interface', () => {
    cirrusSearch.bind(null, 'hello').should.throw()
  })

  describe('format', () => {
    it('should default to json', () => {
      const { searchParams } = new URL(cirrusSearch({ search: 'hello' }))
      searchParams.get('format').should.equal('json')
    })

    it('should accept a custom format', () => {
      const { searchParams } = new URL(cirrusSearch({ search: 'hello', format: 'xml' }))
      searchParams.get('format').should.equal('xml')
    })
  })
})
