const should = require('should')
const getRevisions = require('../lib/queries/get_revisions')
const qs = require('querystring')
const sinceYesterdayInMilliSeconds = new Date().getTime() - 24 * 60 * 60 * 1000
const sinceYesterdayInSeconds = Math.trunc(sinceYesterdayInMilliSeconds / 1000)

describe('getRevisions', function () {
  it('should return a revision query url', function (done) {
    const url = getRevisions('Q3548931')
    url.should.be.a.String()
    const query = qs.parse(url.split('?')[1])
    query.action.should.equal('query')
    query.prop.should.equal('revisions')
    query.titles.should.equal('Q3548931')
    query.rvlimit.should.equal('max')
    query.format.should.equal('json')
    done()
  })

  it('should accept several ids', function (done) {
    const url = getRevisions(['Q3548931', 'Q3548932'])
    const query = qs.parse(url.split('?')[1])
    query.titles.should.equal('Q3548931|Q3548932')
    done()
  })

  it('should accept custom parameters', function (done) {
    const url = getRevisions('Q3548931', { limit: 2, start: sinceYesterdayInSeconds })
    const query = qs.parse(url.split('?')[1])
    query.rvlimit.should.equal('2')
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept time in milliseconds', function (done) {
    const url = getRevisions('Q3548931', { start: sinceYesterdayInMilliSeconds })
    const query = qs.parse(url.split('?')[1])
    query.rvstart.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept time in ISO format', function (done) {
    const ISOtime = new Date(sinceYesterdayInMilliSeconds).toISOString()
    const url = getRevisions('Q3548931', { end: ISOtime })
    const query = qs.parse(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should accept date objects in ISO format', function (done) {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions('Q3548931', { end: dateObj })
    const query = qs.parse(url.split('?')[1])
    query.rvend.should.equal(sinceYesterdayInSeconds.toString())
    done()
  })

  it('should ignore parameters that the API refuses for multiple ids', function (done) {
    const dateObj = new Date(sinceYesterdayInMilliSeconds)
    const url = getRevisions([ 'Q3548931', 'Q3548932' ], { end: dateObj })
    const query = qs.parse(url.split('?')[1])
    should(query.rvend).not.be.ok()
    done()
  })
})
