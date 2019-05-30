const should = require('should')
const qs = require('querystring')

const { buildUrl } = require('./lib/tests_env')
const getEntities = require('../lib/queries/get_entities')(buildUrl)

describe('wikidata getEntities', () => {
  describe('polymorphism', () => {
    it('accepts parameters as multiple arguments', done => {
      const url = getEntities('Q1', 'fr', 'info', 'json')
      url.split('&ids=Q1').length.should.equal(2)
      url.split('&languages=fr').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
      done()
    })

    it('accepts parameters as a unique object argument', done => {
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
  describe('action', () => {
    it('action should be wbgetentities', done => {
      const url = getEntities('Q1')
      url.should.equal(getEntities({ids: 'Q1'}))
      url.should.match(new RegExp('action=wbgetentities&'))
      done()
    })
  })
  describe('ids', () => {
    it('accepts one id as a string', done => {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ids: 'Q535'}))
      url.should.match(new RegExp('&ids=Q535'))
      done()
    })

    it('accepts ids as an array', done => {
      const url = getEntities(['Q535', 'Q7546'])
      url.should.equal(getEntities({ids: ['Q535', 'Q7546']}))
      const url2 = qs.unescape(url)
      // use split(instead of a regexp to work around pipe escapingfunction  issu {
      url2.split('&ids=Q535|Q7546&').length.should.equal(2)
      done()
    })
  })
  describe('languages', () => {
    it('default to no language parameter', done => {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ids: 'Q535'}))
      url.should.not.match(new RegExp('languages'))
      done()
    })

    it('accepts one language as a string', done => {
      const url = getEntities('Q535', 'fr')
      url.should.equal(getEntities({ids: 'Q535', languages: 'fr'}))
      url.should.match(new RegExp('&languages=fr'))
      done()
    })

    it('accepts language as an array', done => {
      const url = getEntities('Q535', ['fr', 'de'])
      url.should.equal(getEntities({ids: 'Q535', languages: ['fr', 'de']}))
      const url2 = qs.unescape(url)
      url2.split('&languages=fr|de').length.should.equal(2)
      done()
    })
  })
  describe('props', () => {
    it('default to no property specified', done => {
      const url = getEntities('Q702741', ['es', 'fi'])
      url.should.equal(getEntities({ids: 'Q702741', languages: ['es', 'fi']}))
      url.should.not.match(new RegExp('&props'))
      done()
    })
    it('include the requested property', done => {
      const url = getEntities({ids: 'Q702741', props: 'claims'})
      url.should.match(new RegExp('&props=claims'))
      done()
    })
    it('include the requested properties', done => {
      const url = getEntities({ids: 'Q702741', props: ['claims', 'info']})
      url.should.match(new RegExp('&props=claims|info'))
      done()
    })
  })
  describe('format', () => {
    it('default to json', done => {
      const url = getEntities('Q702741', ['es', 'fi'])
      url.should.equal(getEntities({ids: 'Q702741', languages: ['es', 'fi']}))
      url.should.match(new RegExp('&format=json'))
      done()
    })
  })
  describe('redirects', () => {
    it('should default to no redirects parameter', done => {
      const url = getEntities('Q535')
      should(url.match('redirects')).not.be.ok()
      done()
    })

    it('should add a redirects parameter if false', done => {
      const url = getEntities({ ids: ['Q535'], redirects: false })
      url.match('redirects=no').should.be.ok()
      done()
    })
  })
})
