require('should')

const { buildUrl } = require('./lib/tests_env')
const searchEntities = require('../lib/queries/search_entities')(buildUrl)

describe('wikidata searchEntities', () => {
  describe('action', () => {
    it('action should be wbsearchentities', () => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('action=wbsearchentities'))
    })
  })

  describe('search', () => {
    it('accepts a string', () => {
      const url = searchEntities('johnnybegood')
      url.should.match(new RegExp('search=johnnybegood'))
    })

    it('accepts an object', () => {
      const url = searchEntities({ search: 'johnnybegood', language: 'fr' })
      url.should.match(new RegExp('search=johnnybegood'))
      url.should.match(new RegExp('language=fr'))
    })

    it('throw on empty string', () => {
      (() => searchEntities('')).should.throw()
    })
  })

  describe('language', () => {
    it('should default on language=en', () => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('language=en'))
    })

    it('should default on continue=0', () => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('continue=0'))
    })

    it('should accept a string', () => {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('language=la'))
    })

    it('should set uselang as language by default', () => {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('uselang=la'))
    })

    it('should accept a uselang parameter different from language', () => {
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
    })
  })

  describe('format', () => {
    it('should have json as default format', () => {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('format=json'))
    })
  })

  describe('encoding', () => {
    it('should url encode the query', () => {
      const url = searchEntities('C#')
      url.should.containEql('C%23')
    })
  })

  describe('type', () => {
    it('should accept a valid type parameter', () => {
      const url = searchEntities({ search: 'alphabet', type: 'property' })
      url.should.match(/type=property/)
    })

    it('should reject an invalid type parameter', () => {
      (() => searchEntities({ search: 'alphabet', type: 'foo' })).should.throw()
    })
  })

  describe('limit', () => {
    it('should reject an invalid type parameter', () => {
      searchEntities({ search: 'alphabet', limit: 10 }).should.match(/limit=10/)
    })
  })

  describe('continue', () => {
    it('should reject an invalid type parameter', () => {
      searchEntities({ search: 'alphabet', continue: 10 }).should.match(/continue=10/)
    })
  })
})
