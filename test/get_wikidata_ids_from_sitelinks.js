require('should')
const qs = require('querystring')
const getIds = require('../lib/queries/get_wikidata_ids_from_sitelinks')

describe('wikidata getWikidataIdsFromSitelinks', function () {
  describe('polymorphism', function () {
    it('accepts parameters as multiple arguments', function (done) {
      const url = getIds('Lyon', 'dewiki', 'en', 'info', 'json')
      url.split('&titles=Lyon').length.should.equal(2)
      url.split('&sites=dewiki').length.should.equal(2)
      url.split('&languages=en').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
      done()
    })

    it('accepts parameters as a unique object argument', function (done) {
      const url = getIds('Lyon', 'dewiki', 'en', 'info', 'json')
      const url2 = getIds({
        titles: 'Lyon',
        sites: 'dewiki',
        languages: 'en',
        props: 'info',
        format: 'json'
      })
      url.should.equal(url2)
      done()
    })
  })

  describe('action', function () {
    it('action should be wbgetentities', function (done) {
      const url = getIds('Lyon')
      url.should.equal(getIds({titles: 'Lyon'}))
      url.should.match(new RegExp('action=wbgetentities&'))
      done()
    })
  })

  describe('titles', function () {
    it('accepts one title as a string', function (done) {
      const url = getIds('Lyon')
      url.should.equal(getIds({titles: 'Lyon'}))
      url.should.match(new RegExp('&titles=Lyon'))
      done()
    })

    it('accepts titles as an array', function (done) {
      const url = getIds(['Lyon', 'Hamburg'])
      url.should.equal(getIds({titles: ['Lyon', 'Hamburg']}))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&titles=Lyon|Hamburg&').length.should.equal(2)
      done()
    })
  })

  describe('sitelinks', function () {
    it('accepts one site as a string', function (done) {
      const url = getIds('Lyon', 'itwiki')
      url.should.equal(getIds({titles: 'Lyon', sites: 'itwiki'}))
      url.should.match(new RegExp('&sites=itwiki'))
      done()
    })

    it('accepts titles as an array', function (done) {
      const url = getIds('Lyon', ['itwiki', 'eswikisource'])
      url.should.equal(getIds({titles: 'Lyon', sites: ['itwiki', 'eswikisource']}))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=itwiki|eswikisource&').length.should.equal(2)
      done()
    })

    it('defaults to the English Wikipedia', function (done) {
      const url = getIds('Lyon')
      url.should.equal(getIds({titles: 'Lyon'}))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=enwiki&').length.should.equal(2)
      done()
    })

    it('converts 2-letters language codes to Wikipedia sites', function (done) {
      const url = getIds('Lyon', ['it', 'fr'])
      url.should.equal(getIds({titles: 'Lyon', sites: ['it', 'fr']}))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=itwiki|frwiki&').length.should.equal(2)
      done()
    })
  })

  describe('languages', function () {
    it('default to no language parameter', function (done) {
      const url = getIds('Lyon')
      url.should.equal(getIds({titles: 'Lyon'}))
      url.should.not.match(new RegExp('languages'))
      done()
    })

    it('accepts one language as a string', function (done) {
      const url = getIds('Lyon', null, 'fr')
      url.should.equal(getIds({titles: 'Lyon', languages: 'fr'}))
      url.should.match(new RegExp('&languages=fr'))
      done()
    })

    it('accepts language as an array', function (done) {
      const url = getIds('Lyon', null, ['fr', 'de'])
      url.should.equal(getIds({titles: 'Lyon', languages: ['fr', 'de']}))
      const url2 = qs.unescape(url)
      url2.split('&languages=fr|de').length.should.equal(2)
      done()
    })
  })

  describe('properties', function () {
    it('default to no property specified', function (done) {
      const url = getIds('Hamburg')
      url.should.not.match(new RegExp('&props'))
      done()
    })
  })

  describe('format', function () {
    it('default to json', function (done) {
      const url = getIds('Hamburg')
      url.should.match(new RegExp('&format=json'))
      done()
    })
  })
})
