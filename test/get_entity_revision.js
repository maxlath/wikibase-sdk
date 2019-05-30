require('should')
const qs = require('querystring')

const { instance } = require('./lib/tests_env')
const getEntityRevision = require('../lib/queries/get_entity_revision')(instance)

describe('getEntityRevision', () => {
  it('should reject an invalid entity id', done => {
    getEntityRevision.bind(null, '3548931').should.throw('invalid entity id: 3548931')
    done()
  })

  it('should reject an invalid revision', done => {
    getEntityRevision.bind(null, 'Q123', 'foo').should.throw('invalid revision id: foo')
    done()
  })

  it('should return an entity revision url [multiple args interface]', done => {
    const url = getEntityRevision('Q3548931', '3548931')
    url.should.be.a.String()
    var [ host, query ] = url.split('?')
    query = qs.parse(query)
    host.should.equal('https://www.wikidata.org/w/index.php')
    query.title.should.equal('Special:EntityData/Q3548931.json')
    query.oldid.should.equal('3548931')
    done()
  })

  it('should return an entity revision url [object interface]', done => {
    const url = getEntityRevision({ id: 'Q3548931', revision: '3548931' })
    url.should.be.a.String()
    var [ host, query ] = url.split('?')
    query = qs.parse(query)
    host.should.equal('https://www.wikidata.org/w/index.php')
    query.title.should.equal('Special:EntityData/Q3548931.json')
    query.oldid.should.equal('3548931')
    done()
  })
})
