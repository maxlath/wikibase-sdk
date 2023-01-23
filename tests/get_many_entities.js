import _ from 'lodash-es'
import should from 'should'
import { GetManyEntities } from '../dist/queries/get_many_entities.js'
import { buildUrl } from './lib/tests_env.js'

const getManyEntities = GetManyEntities(buildUrl)
const manyIds = _.range(1, 80).map(id => `Q${id}`)

describe('wikidata getManyEntities', () => {
  describe('general', () => {
    it('should reject invalid ids', () => {
      getManyEntities.bind(null, [ 'foo' ]).should.throw('invalid entity id: foo')
    })

    it('should return an array of urls', () => {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach(url => /^https/.test(url).should.be.true())
    })
  })
  describe('polymorphism', () => {
    it('should accept parameters as multiple arguments', () => {
      const urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach(url => {
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=info').length.should.equal(2)
        url.split('&format=json').length.should.equal(2)
      })
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
        url.split('&ids=Q').length.should.equal(2)
        url.split('&languages=fr').length.should.equal(2)
        url.split('&props=labels').length.should.equal(2)
        url.split('&format=xml').length.should.equal(2)
      })
    })
  })
  describe('ids', () => {
    it('should throw if passed an id string', () => {
      (() => getManyEntities('Q535')).should.throw()
    })
  })
  describe('redirects', () => {
    it('should default to no redirects parameter', () => {
      const urls = getManyEntities([ 'Q535' ])
      should(urls[0].match('redirects')).not.be.ok()
    })

    it('should add a redirects parameter if false', () => {
      const urls = getManyEntities({ ids: [ 'Q535' ], redirects: false })
      urls[0].match('redirects=no').should.be.ok()
    })
  })
})
