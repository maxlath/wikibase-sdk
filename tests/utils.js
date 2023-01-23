import 'should'
import { isPlainObject } from '../dist/utils/utils.js'

describe('utils', () => {
  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      isPlainObject({}).should.equal(true)
      isPlainObject({ a: 1, b: 2 }).should.equal(true)
    })

    it('should return false for arrays', () => {
      isPlainObject([]).should.equal(false)
      isPlainObject([ 1, 2 ]).should.equal(false)
    })

    it('should return false for strings', () => {
      isPlainObject('').should.equal(false)
      isPlainObject('hello').should.equal(false)
    })

    it('should return false for null', () => {
      isPlainObject(null).should.equal(false)
    })

    it('should return false for undefined', () => {
      isPlainObject().should.equal(false)
    })
  })
})
