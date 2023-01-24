import should from 'should'
import { getRevisionsFactory } from '../src/queries/get_revisions.js'
import { buildUrl } from './lib/tests_env.js'
import { parseQuery } from './lib/utils.js'

const sinceYesterdayInMilliSeconds = new Date().getTime() - 24 * 60 * 60 * 1000
const sinceYesterdayInSeconds = Math.trunc(sinceYesterdayInMilliSeconds / 1000)
const getRevisions = getRevisionsFactory(buildUrl)

describe('getRevisions', () => {
  it('should reject invalid ids', () => {
    getRevisions.bind(null, 'foo').should.throw('invalid entity page title: foo')
  })

  it('should accept namespaced ids invalid ids', () => {
    getRevisions.bind(null, 'Item:Q123').should.not.throw()
    getRevisions.bind(null, 'Property:P123').should.not.throw()
    getRevisions.bind(null, 'Lexeme:L123').should.not.throw()
    getRevisions.bind(null, 'Property:Q123').should.throw('invalid entity page title: Property:Q123')
  })

  it('should return a revision query url', () => {
    const url = getRevisions('Q3548931')
    url.should.be.a.String()
    const query = parseQuery(url.split('?')[1])
    query.action.should.equal('query')
    query.prop.should.equal('revisions')
    query.titles.should.equal('Q3548931')
    query.rvlimit.should.equal('max')
    query.format.should.equal('json')
    query.rvprop.should.equal('ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores')
    query.rvslots.should.equal('*')
  })

  it('should accept several ids', () => {
    const url = getRevisions([ 'Q3548931', 'Q3548932' ])
    const query = parseQuery(url.split('?')[1])
    query.titles.should.equal('Q3548931|Q3548932')
  })

  it('should accept custom parameters', () => {
    const url = getRevisions('Q3548931', { limit: 2, start: sinceYesterdayInSeconds })
    const query = parseQuery(url.split('?')[1])
    query.rvlimit.should.equal('2')
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
  })

  it('should accept time in milliseconds', () => {
    const url = getRevisions('Q3548931', { start: sinceYesterdayInMilliSeconds })
    const query = parseQuery(url.split('?')[1])
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
  })

  it('should accept time in ISO format', () => {
    const ISOtime = new Date(sinceYesterdayInMilliSeconds).toISOString()
    const url = getRevisions('Q3548931', { end: ISOtime })
    const query = parseQuery(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
  })

  it('should accept date objects in ISO format', () => {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions('Q3548931', { end: dateObj })
    const query = parseQuery(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
  })

  it('should ignore parameters that the API refuses for multiple ids', () => {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions([ 'Q3548931', 'Q3548932' ], { end: dateObj })
    const query = parseQuery(url.split('?')[1])
    should(query.rvend).not.be.ok()
  })

  it('should allow to set rvprop as a string', () => {
    const url = getRevisions('Q3548931', { prop: 'tags|user' })
    const query = parseQuery(url.split('?')[1])
    query.rvprop.should.equal('tags|user')
  })

  it('should allow to set rvprop as an array', () => {
    const url = getRevisions('Q3548931', { prop: [ 'tags', 'user' ] })
    const query = parseQuery(url.split('?')[1])
    query.rvprop.should.equal('tags|user')
  })

  it('should allow to set rvuser', () => {
    const url = getRevisions('Q3548931', { user: 'foo' })
    const query = parseQuery(url.split('?')[1])
    query.rvuser.should.equal('foo')
  })

  it('should allow to set rvexcludeuser', () => {
    const url = getRevisions('Q3548931', { excludeuser: 'foo' })
    const query = parseQuery(url.split('?')[1])
    query.rvexcludeuser.should.equal('foo')
  })

  it('should allow to set rvtag', () => {
    const url = getRevisions('Q3548931', { tag: 'foo' })
    const query = parseQuery(url.split('?')[1])
    query.rvtag.should.equal('foo')
  })
})
