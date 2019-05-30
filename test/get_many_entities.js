const should = require('should')
const _ = require('lodash')

const { buildUrl } = require('./lib/tests_env')
const getManyEntities = require('../lib/queries/get_many_entities')(buildUrl)
const manyIds = _.range(1, 80).map(id => `Q${id}`)

describe('wikidata getManyEntities', () => {
  describe('general', () => {
    it('should return an array of urls', done => {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach(url => /^https/.test(url).should.be.true())
      done()
    })
  })
  describe('polymorphism', () => {
    it('should accept parameters as multiple arguments', done => {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach(url => {
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=info').length.should.equal(2)
        url.split('&format=json').length.should.equal(2)
      })
      done()
    })

    it('should accept parameters as a unique object argument', done => {
      const urls = getManyEntities({
        ids: manyIds,
        languages: 'fr',
        props: 'labels',
        format: 'xml'
      })
      urls.should.be.an.Array()
      urls.forEach(url => {
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=labels').length.should.equal(2)
        url.split('&format=xml').length.should.equal(2)
      })
      done()
    })
  })
  describe('ids', () => {
    it('should throw if passed an id string', done => {
      (() => getManyEntities('Q535')).should.throw()
      done()
    })
  })
  describe('redirects', () => {
    it('should default to no redirects parameter', done => {
      const urls = getManyEntities(['Q535'])
      should(urls[0].match('redirects')).not.be.ok()
      done()
    })

    it('should add a redirects parameter if false', done => {
      const urls = getManyEntities({ ids: ['Q535'], redirects: false })
      urls[0].match('redirects=no').should.be.ok()
      done()
    })
  })
})
