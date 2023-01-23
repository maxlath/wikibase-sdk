import 'should'
import { searchEntitiesFactory } from '../dist/queries/search_entities.js'
import { buildUrl } from './lib/tests_env.js'
import { parseUrlQuery } from './lib/utils.js'

const searchEntities = searchEntitiesFactory(buildUrl)

describe('searchEntities', () => {
  describe('action', () => {
    it('action should be wbsearchentities', () => {
      const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }))
      query.action.should.equal('wbsearchentities')
    })
  })

  describe('search', () => {
    it('accepts a string', () => {
      const query = parseUrlQuery(searchEntities({ search: 'johnnybegood' }))
      query.search.should.equal('johnnybegood')
    })

    it('accepts an object', () => {
      const query = parseUrlQuery(searchEntities({ search: 'johnnybegood', language: 'fr' }))
      query.search.should.equal('johnnybegood')
      query.language.should.equal('fr')
    })

    it('throw on empty string', () => {
      (() => searchEntities({ search: '' })).should.throw()
    })

    it('should default to continue=0', () => {
      const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }))
      query.continue.should.equal('0')
    })
  })

  describe('language', () => {
    it('should default on language=en', () => {
      const query = parseUrlQuery(searchEntities({
        search: 'Ingmar Bergman',
      }))
      query.language.should.equal('en')
    })

    it('should accept a string', () => {
      const query = parseUrlQuery(searchEntities({
        search: 'Ingmar Bergman',
        language: 'la',
      }))
      query.language.should.equal('la')
    })

    it('should set uselang as language by default', () => {
      const query = parseUrlQuery(searchEntities({
        search: 'Ingmar Bergman',
        language: 'la',
      }))
      query.uselang.should.equal('la')
    })

    it('should accept a uselang parameter different from language', () => {
      // multi-argument interface
      const query = parseUrlQuery(searchEntities({
        search: 'Ingmar Bergman',
        language: 'la',
        uselang: 'eo',
      }))
      query.language.should.equal('la')
      query.uselang.should.equal('eo')
    })
  })

  describe('format', () => {
    it('should have json as default format', () => {
      const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }))
      query.format.should.equal('json')
    })
  })

  describe('encoding', () => {
    it('should url encode the query', () => {
      const url = searchEntities({ search: 'C#' })
      url.should.containEql('C%23')
    })
  })

  describe('type', () => {
    it('should accept a valid type parameter', () => {
      const query = parseUrlQuery(searchEntities({ search: 'alphabet', type: 'property' }))
      query.type.should.equal('property')
    })

    it('should reject an invalid type parameter', () => {
      (() => searchEntities({ search: 'alphabet', type: 'foo' })).should.throw()
    })
  })

  describe('limit', () => {
    it('should reject an invalid type parameter', () => {
      const query = parseUrlQuery(searchEntities({ search: 'alphabet', limit: 10 }))
      query.limit.should.equal('10')
    })
  })

  describe('continue', () => {
    it('should reject an invalid type parameter', () => {
      const query = parseUrlQuery(searchEntities({ search: 'alphabet', continue: 10 }))
      query.continue.should.equal('10')
    })
  })
})
