require('should')
const { simplifyQualifier, simplifyPropertyQualifiers, simplifyQualifiers } = require('../lib/helpers/simplify_claims')
const Q2112 = require('./data/Q2112.json')

describe('simplifyQualifier', function () {
  it('should simplify a qualifier', done => {
    const qualifier = Q2112.claims.P190[1].qualifiers.P580[0]
    const simplified = simplifyQualifier(qualifier)
    simplified.should.equal('1953-01-01T00:00:00.000Z')
    done()
  })
})

describe('simplifyPropertyQualifiers', function () {
  it('should simplify propertyQualifiers', done => {
    const propertyQualifiers = Q2112.claims.P190[1].qualifiers.P580
    const simplified = simplifyPropertyQualifiers(propertyQualifiers)
    simplified.should.deepEqual([ '1953-01-01T00:00:00.000Z' ])
    done()
  })
})

describe('simplifyQualifiers', function () {
  it('should simplify qualifiers', done => {
    const qualifiers = Q2112.claims.P190[1].qualifiers
    const simplified = simplifyQualifiers(qualifiers)
    simplified.P580.should.deepEqual([ '1953-01-01T00:00:00.000Z' ])
    done()
  })
})
