require('should')

const searchEntities = require('../lib/queries/search_entities')

describe('wikidata searchEntities', function () {
  describe('action', function () {
    it('action should be wbsearchentities', function (done) {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('action=wbsearchentities'))
      done()
    })
  })

  describe('search', function () {
    it('accepts a string', function (done) {
      const url = searchEntities('johnnybegood')
      url.should.match(new RegExp('search=johnnybegood'))
      done()
    })

    it('accepts an object', function (done) {
      const url = searchEntities({search: 'johnnybegood', language: 'fr'})
      url.should.match(new RegExp('search=johnnybegood'))
      url.should.match(new RegExp('language=fr'))
      done()
    })

    it('throw on empty string', function (done) {
      (() => searchEntities('')).should.throw()
      done()
    })
  })

  describe('language', function () {
    it('should default on language=en', function (done) {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('language=en'))
      done()
    })

    it('should accept a string', function (done) {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('language=la'))
      done()
    })

    it('should set uselang as language by default', function (done) {
      const url = searchEntities('Ingmar Bergman', 'la')
      url.should.match(new RegExp('uselang=la'))
      done()
    })

    it('should accept a uselang parameter different from language', function (done) {
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

  describe('format', function () {
    it('should have json as default format', function (done) {
      const url = searchEntities('Ingmar Bergman')
      url.should.match(new RegExp('format=json'))
      done()
    })
  })
})
