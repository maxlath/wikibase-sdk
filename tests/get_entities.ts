import should from 'should'
import { getEntitiesFactory } from '../src/queries/get_entities.js'
import { buildUrl } from './lib/tests_env.js'
import { parseUrlQuery } from './lib/utils.js'

const getEntities = getEntitiesFactory(buildUrl)

describe('wikidata getEntities', () => {
  describe('polymorphism', () => {
    it('rejects parameters as multiple arguments', () => {
      // @ts-ignore
      (() => getEntities('Q1', 'fr', 'info', 'json')).should.throw()
    })

    it('accepts parameters as a unique object argument', () => {
      const url = getEntities({
        ids: 'Q1',
        languages: 'fr',
        props: 'info',
        format: 'json',
      })
      const query = parseUrlQuery(url)
      query.ids.should.equal('Q1')
      query.languages.should.equal('fr')
      query.props.should.equal('info')
      query.format.should.equal('json')
    })
  })

  describe('action', () => {
    it('action should be wbgetentities', () => {
      const query = parseUrlQuery(getEntities({ ids: [ 'Q1' ] }))
      query.action.should.equal('wbgetentities')
    })
  })

  describe('ids', () => {
    it('should reject invalid ids', () => {
      getEntities.bind(null, { ids: 'foo' }).should.throw('invalid entity id: foo')
    })

    it('accepts one id as a string', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535' }))
      query.ids.should.equal('Q535')
    })

    it('accepts ids as an array', () => {
      const query = parseUrlQuery(getEntities({ ids: [ 'Q535', 'Q7546' ] }))
      decodeURIComponent(query.ids).should.equal('Q535|Q7546')
    })

    it('accepts all supported entities types', () => {
      const query = parseUrlQuery(getEntities({ ids: [ 'Q535', 'P123', 'L525' ] }))
      decodeURIComponent(query.ids).should.equal('Q535|P123|L525')
    })
  })

  describe('languages', () => {
    it('defaults to no language parameter', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535' }))
      should(query.languages).not.be.ok()
    })

    it('accepts one language as a string', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535', languages: 'fr' }))
      query.languages.should.equal('fr')
    })

    it('accepts language as an array', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535', languages: [ 'fr', 'de' ] }))
      decodeURIComponent(query.languages).should.equal('fr|de')
    })
  })

  describe('props', () => {
    it('defaults to no property specified', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535' }))
      should(query.props).not.be.ok()
    })
    it('include the requested property', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q702741', props: 'claims' }))
      query.props.should.equal('claims')
    })
    it('include the requested properties', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q702741', props: [ 'claims', 'info' ] }))
      decodeURIComponent(query.props).should.equal('claims|info')
    })
  })

  describe('format', () => {
    it('defaults to json', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535' }))
      query.format.should.equal('json')
    })
  })

  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535' }))
      should(query.redirects).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const query = parseUrlQuery(getEntities({ ids: 'Q535', redirects: false }))
      query.redirects.should.equal('no')
    })
  })
})
