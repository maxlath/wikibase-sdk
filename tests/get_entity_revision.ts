import 'should'
import { getEntityRevisionFactory } from '../src/queries/get_entity_revision.js'
import { instance, wgScriptPath } from './lib/tests_env.js'
import { parseQuery } from './lib/utils.js'

const getEntityRevision = getEntityRevisionFactory(instance, wgScriptPath)

describe('getEntityRevision', () => {
  it('should reject an invalid entity id', () => {
    // @ts-expect-error
    (() => getEntityRevision({ id: '3548931' })).should.throw('invalid entity id: 3548931')
  })

  it('should reject an invalid revision', () => {
    // @ts-expect-error
    (() => getEntityRevision({ id: 'Q123', revision: 'foo' })).should.throw('invalid revision id: foo')
  })

  it('should return an entity revision url [multiple args interface]', () => {
    const url = getEntityRevision({ id: 'Q3548931', revision: '3548931' })
    url.should.be.a.String()
    const [ host, query ] = url.split('?')
    const parsedQuery = parseQuery(query)
    host.should.equal('https://www.wikidata.org/w/index.php')
    parsedQuery.title.should.equal('Special:EntityData/Q3548931.json')
    parsedQuery.revision.should.equal('3548931')
  })

  it('should return an entity revision url [object interface]', () => {
    const url = getEntityRevision({ id: 'Q3548931', revision: '3548931' })
    url.should.be.a.String()
    const [ host, query ] = url.split('?')
    const parsedQuery = parseQuery(query)
    host.should.equal('https://www.wikidata.org/w/index.php')
    parsedQuery.title.should.equal('Special:EntityData/Q3548931.json')
    parsedQuery.revision.should.equal('3548931')
  })
})
