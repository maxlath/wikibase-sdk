require('should')

const { buildUrl } = require('./lib/tests_env')
const searchEntities = require('../lib/queries/search_entities')(buildUrl)

describe('wikidata searchEntities', () => {
  describe('action', () => {
    it('action should be wbsearchentities', done => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('action=wbsearchentities'))
      done()
    })
  })

  describe('search', () => {
    it('accepts a string', done => {
      const url = searchEntities('johnnybegood')
      url.should.match(new RegExp('search=johnnybegood'))
      done()
    })

    it('accepts an object', done => {
      const url = searchEntities({search: 'johnnybegood', language: 'fr'})
      url.should.match(new RegExp('search=johnnybegood'))
      url.should.match(new RegExp('language=fr'))
      done()
    })

    it('throw on empty string', done => {
      (() => searchEntities('')).should.throw()
      done()
    })
  })

  describe('language', () => {
    it('should default on language=en', done => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('language=en'))
      done()
    })

    it('should accept a string', done => {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('language=la'))
      done()
    })

    it('should set uselang as language by default', done => {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('uselang=la'))
      done()
    })

    it('should accept a uselang parameter different from language', done => {
      // multi-argument interface
      const url = searchEntities('Ingmar Bergman', 'la', null, null, 'eo')
      url.should.match(new RegExp('language=la'))
      url.should.match(new RegExp('uselang=eo'))
      // object interface
      const url2 = searchEntities({
        search: 'Ingmar Bergman',
        language: 'la',
        uselang: 'eo'
      })
      url2.should.match(new RegExp('language=la'))
      url2.should.match(new RegExp('uselang=eo'))
      done()
    })
  })

  describe('format', () => {
    it('should have json as default format', done => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('format=json'))
      done()
    })
  })

  describe('encoding', () => {
    it('should url encode the query', done => {
      const url = searchEntities('C#')
      url.should.containEql('C%23')
      done()
    })
  })

  describe('type', () => {
    it('should accept a valid type parameter', done => {
      const url = searchEntities({ search: 'alphabet', type: 'property' })
      url.should.match(/type=property/)
      done()
    })

    it('should reject an invalid type parameter', done => {
      (() => searchEntities({ search: 'alphabet', type: 'foo' })).should.throw()
      done()
    })
  })

  describe('limit', () => {
    it('should reject an invalid type parameter', done => {
      searchEntities({ search: 'alphabet', limit: 10 }).should.match(/limit=10/)
      done()
    })
  })

  describe('continue', () => {
    it('should reject an invalid type parameter', done => {
      searchEntities({ search: 'alphabet', continue: 10 }).should.match(/continue=10/)
      done()
    })
  })
})
