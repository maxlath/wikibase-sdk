const should = require('should')
const qs = require('querystring')
const { buildUrl } = require('./lib/tests_env')
const getEntitiesFromSitelinks = require('../lib/queries/get_entities_from_sitelinks')(buildUrl)

describe('getEntitiesFromSitelinks', () => {
  describe('polymorphism', () => {
    it('accepts parameters as multiple arguments', () => {
      const url = getEntitiesFromSitelinks('Lyon', 'dewiki', 'en', 'info', 'json')
      url.split('&titles=Lyon').length.should.equal(2)
      url.split('&sites=dewiki').length.should.equal(2)
      url.split('&languages=en').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
    })

    it('accepts parameters as a unique object argument', () => {
      const url = getEntitiesFromSitelinks('Lyon', 'dewiki', 'en', 'info', 'json')
      const url2 = getEntitiesFromSitelinks({
        titles: 'Lyon',
        sites: 'dewiki',
        languages: 'en',
        props: 'info',
        format: 'json'
      })
      url.should.equal(url2)
    })
  })

  describe('action', () => {
    it('action should be wbgetentities', () => {
      const url = getEntitiesFromSitelinks('Lyon')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      url.should.match(new RegExp('action=wbgetentities&'))
    })
  })

  describe('titles', () => {
    it('accepts one title as a string', () => {
      const url = getEntitiesFromSitelinks('Lyon')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      url.should.match(new RegExp('&titles=Lyon'))
    })

    it('accepts titles as an array', () => {
      const url = getEntitiesFromSitelinks([ 'Lyon', 'Hamburg' ])
      url.should.equal(getEntitiesFromSitelinks({ titles: [ 'Lyon', 'Hamburg' ] }))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&titles=Lyon|Hamburg&').length.should.equal(2)
    })
  })

  describe('sitelinks', () => {
    it('accepts one site as a string', () => {
      const url = getEntitiesFromSitelinks('Lyon', 'itwiki')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon', sites: 'itwiki' }))
      url.should.match(new RegExp('&sites=itwiki'))
    })

    it('accepts titles as an array', () => {
      const url = getEntitiesFromSitelinks('Lyon', [ 'itwiki', 'eswikisource' ])
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon', sites: [ 'itwiki', 'eswikisource' ] }))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=itwiki|eswikisource&').length.should.equal(2)
    })

    it('defaults to the English Wikipedia', () => {
      const url = getEntitiesFromSitelinks('Lyon')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=enwiki&').length.should.equal(2)
    })

    it('converts 2-letters language codes to Wikipedia sites', () => {
      const url = getEntitiesFromSitelinks('Lyon', [ 'it', 'fr' ])
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon', sites: [ 'it', 'fr' ] }))
      const url2 = qs.unescape(url)
      // use splitinstead of a regexp to work around pipe escaping issues
      url2.split('&sites=itwiki|frwiki&').length.should.equal(2)
    })
  })

  describe('languages', () => {
    it('default to no language parameter', () => {
      const url = getEntitiesFromSitelinks('Lyon')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      url.should.not.match(new RegExp('languages'))
    })

    it('accepts one language as a string', () => {
      const url = getEntitiesFromSitelinks('Lyon', null, 'fr')
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon', languages: 'fr' }))
      url.should.match(new RegExp('&languages=fr'))
    })

    it('accepts language as an array', () => {
      const url = getEntitiesFromSitelinks('Lyon', null, [ 'fr', 'de' ])
      url.should.equal(getEntitiesFromSitelinks({ titles: 'Lyon', languages: [ 'fr', 'de' ] }))
      const url2 = qs.unescape(url)
      url2.split('&languages=fr|de').length.should.equal(2)
    })
  })

  describe('properties', () => {
    it('defaults to no property specified', () => {
      const url = getEntitiesFromSitelinks('Hamburg')
      url.should.not.match(new RegExp('&props'))
    })
  })

  describe('format', () => {
    it('default to json', () => {
      const url = getEntitiesFromSitelinks('Hamburg')
      url.should.match(new RegExp('&format=json'))
    })
  })

  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const url = getEntitiesFromSitelinks('Hamburg')
      should(url.match('redirects')).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const url = getEntitiesFromSitelinks({ titles: 'Hamburg', redirects: false })
      url.match('redirects=no').should.be.ok()
    })
  })
})
