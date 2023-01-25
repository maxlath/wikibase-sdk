import should from 'should'
import { getEntitiesFromSitelinksFactory } from '../src/queries/get_entities_from_sitelinks.js'
import { buildUrl } from './lib/tests_env.js'
import { parseUrlQuery } from './lib/utils.js'

const getEntitiesFromSitelinks = getEntitiesFromSitelinksFactory(buildUrl)

describe('getEntitiesFromSitelinks', () => {
  describe('polymorphism', () => {
    it('rejects parameters as multiple arguments', () => {
      // @ts-ignore
      (() => getEntitiesFromSitelinks('Lyon')).should.throw()
      // @ts-ignore
      ;(() => getEntitiesFromSitelinks('Lyon', 'en')).should.throw()
    })
  })

  describe('action', () => {
    it('action should be wbgetentities', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      query.action.should.equal('wbgetentities')
    })
  })

  describe('titles', () => {
    it('accepts one title as a string', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      query.titles.should.equal('Lyon')
    })

    it('accepts titles as an array', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: [ 'Lyon', 'Hamburg' ] }))
      query.titles.should.equal('Lyon|Hamburg')
    })
  })

  describe('sitelinks', () => {
    it('accepts one site as a string', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: 'itwiki' }))
      query.sites.should.equal('itwiki')
    })

    it('accepts titles as an array', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: [ 'itwiki', 'eswikisource' ] }))
      query.sites.should.equal('itwiki|eswikisource')
    })

    it('defaults to the English Wikipedia', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      query.sites.should.equal('enwiki')
    })

    it('converts 2-letters language codes to Wikipedia sites', () => {
      // @ts-ignore
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: [ 'it', 'fr' ] }))
      query.sites.should.equal('itwiki|frwiki')
    })
  })

  describe('languages', () => {
    it('default to no language parameter', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      should(query.languages).not.be.ok()
    })

    it('accepts one language as a string', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', languages: 'fr' }))
      query.languages.should.equal('fr')
    })

    it('accepts language as an array', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', languages: [ 'fr', 'de' ] }))
      query.languages.should.equal('fr|de')
    })
  })

  describe('properties', () => {
    it('defaults to no property specified', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      should(query.props).not.be.ok()
    })
  })

  describe('format', () => {
    it('default to json', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      query.format.should.equal('json')
    })
  })

  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }))
      should(query.redirects).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', redirects: false }))
      query.redirects.should.equal('no')
    })
  })
})
