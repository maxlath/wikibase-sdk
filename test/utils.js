require('should')

const utils = require('../lib/utils/utils')

describe('utils', () => {
  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      utils.isPlainObject({}).should.equal(true)
      utils.isPlainObject({ a: 1, b: 2 }).should.equal(true)
    })

    it('should return false for arrays', () => {
      utils.isPlainObject([]).should.equal(false)
      utils.isPlainObject([ 1, 2 ]).should.equal(false)
    })

    it('should return false for strings', () => {
      utils.isPlainObject('').should.equal(false)
      utils.isPlainObject('hello').should.equal(false)
    })

    it('should return false for null', () => {
      utils.isPlainObject(null).should.equal(false)
    })

    it('should return false for undefined', () => {
      utils.isPlainObject().should.equal(false)
    })
  })
})
