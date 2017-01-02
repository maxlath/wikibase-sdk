require('should')
const _ = require('lodash')

const getManyEntities = require('../lib/queries/get_many_entities')
const manyIds = _.range(1, 80).map((id) => `Q${id}`)

describe('wikidata getManyEntities', function () {
  describe('general', function () {
    it('should return an array of urls', function (done) {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach((url) => /^https/.test(url).should.be.true())
      done()
    })
  })
  describe('polymorphism', function () {
    it('should accept parameters as multiple arguments', function (done) {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach(function (url) {
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=info').length.should.equal(2)
        url.split('&format=json').length.should.equal(2)
      })
      done()
    })

    it('should accept parameters as a unique object argument', function (done) {
      const urls = getManyEntities({
        ids: manyIds,
        languages: 'fr',
        props: 'labels',
        format: 'xml'
      })
      urls.should.be.an.Array()
      urls.forEach(function (url) {
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=labels').length.should.equal(2)
        url.split('&format=xml').length.should.equal(2)
      })
      done()
    })
  })
  describe('ids', function () {
    it('should throw if passed an id string', function (done) {
      (() => getManyEntities('Q535')).should.throw()
      done()
    })
  })
})
