require('should')
const qs = require('querystring')

const getEntities = require('../lib/queries/get_entities')

describe('wikidata getEntities', function () {
  describe('polymorphism', function () {
    it('accepts parameters as multiple arguments', function (done) {
      const url = getEntities('Q1', 'fr', 'info', 'json')
      url.split('&ids=Q1').length.should.equal(2)
      url.split('&languages=fr').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
      done()
    })

    it('accepts parameters as a unique object argument', function (done) {
      const url = getEntities({
        ids: 'Q1',
        languages: 'fr',
        props: 'info',
        format: 'json'
      })

      url.split('&ids=Q1').length.should.equal(2)
      url.split('&languages=fr').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
      done()
    })
  })
  describe('action', function () {
    it('action should be wbgetentities', function (done) {
      const url = getEntities('Q1')
      url.should.equal(getEntities({ids: 'Q1'}))
      url.should.match(new RegExp('action=wbgetentities&'))
      done()
    })
  })
  describe('ids', function () {
    it('accepts one id as a string', function (done) {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ids: 'Q535'}))
      url.should.match(new RegExp('&ids=Q535'))
      done()
    })

    it('accepts ids as an array', function (done) {
      const url = getEntities(['Q535', 'Q7546'])
      url.should.equal(getEntities({ids: ['Q535', 'Q7546']}))
      const url2 = qs.unescape(url)
      // use split(instead of a regexp to work around pipe escapingfunction  issu {
      url2.split('&ids=Q535|Q7546&').length.should.equal(2)
      done()
    })
  })
  describe('languages', function () {
    it('default to no language parameter', function (done) {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ids: 'Q535'}))
      url.should.not.match(new RegExp('languages'))
      done()
    })

    it('accepts one language as a string', function (done) {
      const url = getEntities('Q535', 'fr')
      url.should.equal(getEntities({ids: 'Q535', languages: 'fr'}))
      url.should.match(new RegExp('&languages=fr'))
      done()
    })

    it('accepts language as an array', function (done) {
      const url = getEntities('Q535', ['fr', 'de'])
      url.should.equal(getEntities({ids: 'Q535', languages: ['fr', 'de']}))
      const url2 = qs.unescape(url)
      url2.split('&languages=fr|de').length.should.equal(2)
      done()
    })
  })
  describe('props', function () {
    it('default to no property specified', function (done) {
      const url = getEntities('Q702741', ['es', 'fi'])
      url.should.equal(getEntities({ids: 'Q702741', languages: ['es', 'fi']}))
      url.should.not.match(new RegExp('&props'))
      done()
    })
    it('include the requested property', function (done) {
      const url = getEntities({ids: 'Q702741', props: 'claims'})
      url.should.match(new RegExp('&props=claims'))
      done()
    })
    it('include the requested properties', function (done) {
      const url = getEntities({ids: 'Q702741', props: ['claims', 'info']})
      url.should.match(new RegExp('&props=claims|info'))
      done()
    })
  })
  describe('format', function () {
    it('default to json', function (done) {
      const url = getEntities('Q702741', ['es', 'fi'])
      url.should.equal(getEntities({ids: 'Q702741', languages: ['es', 'fi']}))
      url.should.match(new RegExp('&format=json'))
      done()
    })
  })
})
