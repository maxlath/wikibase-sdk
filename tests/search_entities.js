import 'should'
import { URL } from 'node:url'
import { SearchEntities } from '../lib/queries/search_entities.js'
import { buildUrl } from './lib/tests_env.js'

const searchEntities = SearchEntities(buildUrl)

describe('searchEntities', () => {
  describe('action', () => {
    it('action should be wbsearchentities', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman'))
      searchParams.get('action').should.equal('wbsearchentities')
    })
  })

  describe('search', () => {
    it('accepts a string', () => {
      const { searchParams } = new URL(searchEntities('johnnybegood'))
      searchParams.get('search').should.equal('johnnybegood')
    })

    it('accepts an object', () => {
      const { searchParams } = new URL(searchEntities({ search: 'johnnybegood', language: 'fr' }))
      searchParams.get('search').should.equal('johnnybegood')
      searchParams.get('language').should.equal('fr')
    })

    it('throw on empty string', () => {
      (() => searchEntities('')).should.throw()
    })
  })

  describe('language', () => {
    it('should default on language=en', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman'))
      searchParams.get('language').should.equal('en')
    })

    it('should default on continue=0', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman'))
      searchParams.get('continue').should.equal('0')
    })

    it('should accept a string', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman', 'la'))
      searchParams.get('language').should.equal('la')
    })

    it('should set uselang as language by default', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman', 'la'))
      searchParams.get('uselang').should.equal('la')
    })

    it('should accept a uselang parameter different from language', () => {
      // multi-argument interface
      const { searchParams } = new URL(searchEntities('Ingmar Bergman', 'la', null, null, 'eo'))
      searchParams.get('language').should.equal('la')
      searchParams.get('uselang').should.equal('eo')
      // object interface
      const { searchParams: searchParams2 } = new URL(searchEntities({
        search: 'Ingmar Bergman',
        language: 'la',
        uselang: 'eo',
      }))
      searchParams2.get('language').should.equal('la')
      searchParams2.get('uselang').should.equal('eo')
    })
  })

  describe('format', () => {
    it('should have json as default format', () => {
      const { searchParams } = new URL(searchEntities('Ingmar Bergman'))
      searchParams.get('format').should.equal('json')
    })
  })

  describe('encoding', () => {
    it('should url encode the query', () => {
      const url = searchEntities('C#')
      url.should.containEql('C%23')
    })
  })

  describe('type', () => {
    it('should accept a valid type parameter', () => {
      const { searchParams } = new URL(searchEntities({ search: 'alphabet', type: 'property' }))
      searchParams.get('type').should.equal('property')
    })

    it('should reject an invalid type parameter', () => {
      (() => searchEntities({ search: 'alphabet', type: 'foo' })).should.throw()
    })
  })

  describe('limit', () => {
    it('should reject an invalid type parameter', () => {
      const { searchParams } = new URL(searchEntities({ search: 'alphabet', limit: 10 }))
      searchParams.get('limit').should.equal('10')
    })
  })

  describe('continue', () => {
    it('should reject an invalid type parameter', () => {
      const { searchParams } = new URL(searchEntities({ search: 'alphabet', continue: 10 }))
      searchParams.get('continue').should.equal('10')
    })
  })
})
