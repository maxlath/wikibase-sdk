require('should')

const utils = require('../lib/utils/utils')

describe('utils', function () {
  describe('isPlainObject', function () {
    it('should return true for plain objects', function (done) {
      utils.isPlainObject({}).should.equal(true)
      utils.isPlainObject({a: 1, b: 2}).should.equal(true)
      done()
    })

    it('should return false for arrays', function (done) {
      utils.isPlainObject([]).should.equal(false)
      utils.isPlainObject([1, 2]).should.equal(false)
      done()
    })

    it('should return false for strings', function (done) {
      utils.isPlainObject('').should.equal(false)
      utils.isPlainObject('hello').should.equal(false)
      done()
    })

    it('should return false for null', function (done) {
      utils.isPlainObject(null).should.equal(false)
      done()
    })

    it('should return false for undefined', function (done) {
      utils.isPlainObject().should.equal(false)
      done()
    })
  })
})
