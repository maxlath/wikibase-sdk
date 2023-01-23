import should from 'should'
import { simplifyQualifier, simplifyPropertyQualifiers, simplifyQualifiers } from '../dist/helpers/simplify_claims.js'
import { requireJson } from './lib/utils.js'

const Q19180293 = requireJson(import.meta.url, './data/Q19180293.json')
const Q2112 = requireJson(import.meta.url, './data/Q2112.json')
const Q571 = requireJson(import.meta.url, './data/Q571.json')

describe('simplifyQualifier', () => {
  it('should simplify a qualifier', () => {
    const qualifier = Q2112.claims.P190[1].qualifiers.P580[0]
    const simplified = simplifyQualifier(qualifier)
    simplified.should.equal('1953-01-01T00:00:00.000Z')
  })

  describe('empty values', () => {
    it('should return the desired novalueValue', () => {
      const noValueQualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0]
      should(simplifyQualifier(noValueQualifier)).not.be.ok()
      simplifyQualifier(noValueQualifier, { novalueValue: '-' }).should.equal('-')
      simplifyQualifier(noValueQualifier, { novalueValue: '' }).should.equal('')
    })

    it('should return the desired somevalueValue', () => {
      const someValueQualifier = Q19180293.claims.P1433[0].qualifiers.P156[0]
      should(simplifyQualifier(someValueQualifier)).not.be.ok()
      simplifyQualifier(someValueQualifier, { somevalueValue: '?' }).should.equal('?')
      simplifyQualifier(someValueQualifier, { somevalueValue: '' }).should.equal('')
    })

    it('should accept null as a possible value', () => {
      const noValueQualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0]
      should(simplifyQualifier(noValueQualifier, { novalueValue: null }) === null).be.true()
    })
  })

  describe('time', () => {
    it('should respect timeConverter for qualifiers claims', () => {
      const qualifier = Q571.claims.P1709[0].qualifiers.P813[0]
      const timeClaim = timeConverter => simplifyQualifier(qualifier, { timeConverter })
      timeClaim('iso').should.equal('2015-06-11T00:00:00.000Z')
      timeClaim('epoch').should.equal(1433980800000)
      timeClaim('simple-day').should.equal('2015-06-11')
      timeClaim('none').should.equal('+2015-06-11T00:00:00Z')
      const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`
      timeClaim(timeConverterFn).should.equal('foo/+2015-06-11T00:00:00Z/11/bar')
    })
  })
})

describe('simplifyPropertyQualifiers', () => {
  it('should simplify propertyQualifiers', () => {
    const propertyQualifiers = Q2112.claims.P190[1].qualifiers.P580
    const simplified = simplifyPropertyQualifiers(propertyQualifiers)
    simplified.should.deepEqual([ '1953-01-01T00:00:00.000Z' ])
  })

  describe('empty values', () => {
    it('should return the desired novalueValue', () => {
      const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P1100
      simplifyPropertyQualifiers(propQualifiers, { novalueValue: '-' }).should.deepEqual([ '-' ])
      simplifyPropertyQualifiers(propQualifiers, { novalueValue: '' }).should.deepEqual([ '' ])
    })

    it('should return the desired somevalueValue', () => {
      const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P156
      simplifyPropertyQualifiers(propQualifiers, { somevalueValue: '?' }).should.deepEqual([ '?' ])
      simplifyPropertyQualifiers(propQualifiers, { somevalueValue: '' }).should.deepEqual([ '' ])
    })

    it('should accept null as a possible value', () => {
      const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P1100
      simplifyPropertyQualifiers(propQualifiers, { novalueValue: null }).should.deepEqual([ null ])
    })
  })
})

describe('simplifyQualifiers', () => {
  it('should simplify qualifiers', () => {
    const qualifiers = Q2112.claims.P190[1].qualifiers
    const simplified = simplifyQualifiers(qualifiers)
    simplified.P580.should.deepEqual([ '1953-01-01T00:00:00.000Z' ])
  })

  describe('empty values', () => {
    it('should return the desired novalueValue', () => {
      const qualifiers = Q19180293.claims.P1433[0].qualifiers
      simplifyQualifiers(qualifiers, { novalueValue: '-' }).P1100.should.deepEqual([ '-' ])
      simplifyQualifiers(qualifiers, { novalueValue: '' }).P1100.should.deepEqual([ '' ])
    })

    it('should return the desired somevalueValue', () => {
      const qualifiers = Q19180293.claims.P1433[0].qualifiers
      simplifyQualifiers(qualifiers, { somevalueValue: '?' }).P156.should.deepEqual([ '?' ])
      simplifyQualifiers(qualifiers, { somevalueValue: '' }).P156.should.deepEqual([ '' ])
    })

    it('should accept null as a possible value', () => {
      const qualifiers = Q19180293.claims.P1433[0].qualifiers
      simplifyQualifiers(qualifiers, { novalueValue: null }).P1100.should.deepEqual([ null ])
    })

    it('should keep snaktype if requested', () => {
      const qualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0]
      simplifyQualifier(qualifier, { keepSnaktypes: true })
      .should.deepEqual({ value: undefined, snaktype: 'novalue' }
      )
    })
  })
})
