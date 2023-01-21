import should from 'should'
import { GetEntities } from '../lib/queries/get_entities.js'
import { buildUrl } from './lib/tests_env.js'

const getEntities = GetEntities(buildUrl)

describe('wikidata getEntities', () => {
  describe('polymorphism', () => {
    it('accepts parameters as multiple arguments', () => {
      const url = getEntities('Q1', 'fr', 'info', 'json')
      url.split('&ids=Q1').length.should.equal(2)
      url.split('&languages=fr').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
    })

    it('accepts parameters as a unique object argument', () => {
      const url = getEntities({
        ids: 'Q1',
        languages: 'fr',
        props: 'info',
        format: 'json',
      })

      url.split('&ids=Q1').length.should.equal(2)
      url.split('&languages=fr').length.should.equal(2)
      url.split('&props=info').length.should.equal(2)
      url.split('&format=json').length.should.equal(2)
    })
  })
  describe('action', () => {
    it('action should be wbgetentities', () => {
      const url = getEntities('Q1')
      url.should.equal(getEntities({ ids: 'Q1' }))
      url.should.match(/action=wbgetentities&/)
    })
  })
  describe('ids', () => {
    it('should reject invalid ids', () => {
      getEntities.bind(null, 'foo').should.throw('invalid entity id: foo')
    })

    it('accepts one id as a string', () => {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ ids: 'Q535' }))
      url.should.match(/&ids=Q535/)
    })

    it('accepts ids as an array', () => {
      const url = getEntities([ 'Q535', 'Q7546' ])
      url.should.equal(getEntities({ ids: [ 'Q535', 'Q7546' ] }))
      const url2 = decodeURIComponent(url)
      // use split(instead of a regexp to work around pipe escapingfunction  issu {
      url2.split('&ids=Q535|Q7546&').length.should.equal(2)
    })

    it('accepts all supported entities types', () => {
      const url = getEntities([ 'Q535', 'P123', 'L525' ])
      decodeURIComponent(url).should.containEql('&ids=Q535|P123|L525&')
    })
  })
  describe('languages', () => {
    it('default to no language parameter', () => {
      const url = getEntities('Q535')
      url.should.equal(getEntities({ ids: 'Q535' }))
      url.should.not.match(/languages/)
    })

    it('accepts one language as a string', () => {
      const url = getEntities('Q535', 'fr')
      url.should.equal(getEntities({ ids: 'Q535', languages: 'fr' }))
      url.should.match(/&languages=fr/)
    })

    it('accepts language as an array', () => {
      const url = getEntities('Q535', [ 'fr', 'de' ])
      url.should.equal(getEntities({ ids: 'Q535', languages: [ 'fr', 'de' ] }))
      const url2 = decodeURIComponent(url)
      url2.split('&languages=fr|de').length.should.equal(2)
    })
  })
  describe('props', () => {
    it('default to no property specified', () => {
      const url = getEntities('Q702741', [ 'es', 'fi' ])
      url.should.equal(getEntities({ ids: 'Q702741', languages: [ 'es', 'fi' ] }))
      url.should.not.match(/&props/)
    })
    it('include the requested property', () => {
      const url = getEntities({ ids: 'Q702741', props: 'claims' })
      url.should.match(/&props=claims/)
    })
    it('include the requested properties', () => {
      const url = getEntities({ ids: 'Q702741', props: [ 'claims', 'info' ] })
      url.should.match(/&props=claims|info/)
    })
  })
  describe('format', () => {
    it('default to json', () => {
      const url = getEntities('Q702741', [ 'es', 'fi' ])
      url.should.equal(getEntities({ ids: 'Q702741', languages: [ 'es', 'fi' ] }))
      url.should.match(/&format=json/)
    })
  })
  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const url = getEntities('Q535')
      should(url.match('redirects')).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const url = getEntities({ ids: [ 'Q535' ], redirects: false })
      url.match('redirects=no').should.be.ok()
    })
  })
})
