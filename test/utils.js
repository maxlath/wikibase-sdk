require('should')

const utils = require('../lib/utils/utils')

describe('utils', () => {
  describe('isPlainObject', () => {
    it('should return true for plain objects', done => {
      utils.isPlainObject({}).should.equal(true)
      utils.isPlainObject({a: 1, b: 2}).should.equal(true)
      done()
    })

    it('should return false for arrays', done => {
      utils.isPlainObject([]).should.equal(false)
      utils.isPlainObject([1, 2]).should.equal(false)
      done()
    })

    it('should return false for strings', done => {
      utils.isPlainObject('').should.equal(false)
      utils.isPlainObject('hello').should.equal(false)
      done()
    })

    it('should return false for null', done => {
      utils.isPlainObject(null).should.equal(false)
      done()
    })

    it('should return false for undefined', done => {
      utils.isPlainObject().should.equal(false)
      done()
    })
  })
})
