import { range } from 'lodash-es'
import should from 'should'
import { getManyEntitiesFactory } from '../src/queries/get_many_entities.js'
import { buildUrl } from './lib/tests_env.js'
import { parseUrlQuery } from './lib/utils.js'
import type { ItemId } from '../src/types/entity.js'

const getManyEntities = getManyEntitiesFactory(buildUrl)
const manyIds = range(1, 80).map(id => `Q${id}` as ItemId)

describe('wikidata getManyEntities', () => {
  describe('general', () => {
    it('should reject invalid ids', () => {
      getManyEntities.bind(null, { ids: [ 'foo' ] }).should.throw('invalid entity id: foo')
    })

    it('should return an array of urls', () => {
      const urls = getManyEntities({ ids: manyIds })
      urls.should.be.an.Array()
      urls.forEach(url => /^https/.test(url).should.be.true())
    })
  })

  describe('polymorphism', () => {
    it('should reject parameters as multiple arguments', () => {
      // @ts-expect-error
      (() => getManyEntities(manyIds, 'fr', 'info', 'json')).should.throw()
    })

    it('should accept parameters as a unique object argument', () => {
      const urls = getManyEntities({
        ids: manyIds,
        languages: 'fr',
        props: 'labels',
        format: 'xml',
      })
      urls.should.be.an.Array()
      urls.forEach(url => {
        const query = parseUrlQuery(url)
        query.ids.should.startWith('Q')
        query.languages.should.equal('fr')
        query.props.should.equal('labels')
        query.format.should.equal('xml')
      })
    })
  })

  describe('ids', () => {
    it('should throw if passed an id string', () => {
      // @ts-expect-error
      (() => getManyEntities({ ids: 'Q535' })).should.throw()
    })
  })

  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const urls = getManyEntities({ ids: [ 'Q535' ] })
      should(urls[0].match('redirects')).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const urls = getManyEntities({ ids: [ 'Q535' ], redirects: false })
      const url = urls[0] as string
      parseUrlQuery(url).redirects.should.equal('no')
    })
  })
})
