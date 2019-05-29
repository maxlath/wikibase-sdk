require('should')

const qsLite = require('../lib/utils/querystring_lite')

describe('qsLite', () => {
  it('env', done => {
    qsLite.should.be.an.Object()
    qsLite.stringify.should.be.a.Function()
    done()
  })

  describe('stringify', () => {
    it('should return a query string', done => {
      const query = {
        name: 'Bond',
        drink: 'martini'
      }
      const qstring = qsLite.stringify(query)
      qstring.should.be.a.String()
      qstring.should.be.equal('name=Bond&drink=martini')
      done()
    })
  })
})
