require('should')
const _ = require('lodash')
const Q4115189 = require('./data/Q4115189.json')
const { truthyClaims, truthyPropertyClaims } = require('../lib/helpers/rank')

describe('truthyClaims', () => {
  it('should filter-out non-truthy claims', done => {
    const Q4115189Claims = _.cloneDeep(Q4115189.claims)
    Q4115189Claims.P135.length.should.equal(3)
    const truthyOnly = truthyClaims(Q4115189Claims)
    truthyOnly.P135.length.should.equal(1)
    truthyOnly.P135[0].mainsnak.datavalue.value.id.should.equal('Q2044250')
    done()
  })
})

describe('truthyPropertyClaims', () => {
  it('should filter-out non-truthy property claims', done => {
    const Q4115189Claims = _.cloneDeep(Q4115189.claims)
    Q4115189Claims.P135.length.should.equal(3)
    const truthyOnly = truthyPropertyClaims(Q4115189Claims.P135)
    truthyOnly.length.should.equal(1)
    truthyOnly[0].mainsnak.datavalue.value.id.should.equal('Q2044250')
    done()
  })
})
