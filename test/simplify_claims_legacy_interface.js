require('should')
const Q571 = require('./data/Q571.json')
const Q646148 = require('./data/Q646148.json')
const Q2112 = require('./data/Q2112.json')

const { simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('../lib/helpers/simplify_claims')

describe('simplify claims functions legacy options interface', () => {
  describe('simplifyClaims', () => {
    it('should pass entity and property prefixes down', done => {
      simplifyClaims(Q2112.claims, 'wd').P190[0].should.equal('wd:Q207614')
      simplifyClaims(Q2112.claims, null, 'wdt')['wdt:P123456789'][0].should.equal('P207614')
      done()
    })

    it('should return prefixed properties if passed a property prefix', done => {
      const simplified = simplifyClaims(Q2112.claims, 'wd', 'wdt')
      simplified['wdt:P190'].should.be.an.Array()
      simplified['wdt:P190'][0].should.equal('wd:Q207614')
      const simplified2 = simplifyClaims(Q2112.claims, null, 'wdt')
      simplified2['wdt:P123456789'][0].should.equal('P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', done => {
      const simplified = simplifyClaims(Q571.claims)
      const simplifiedWithQualifiers = simplifyClaims(Q571.claims, null, null, true)
      for (let property in simplifiedWithQualifiers) {
        let propertyValues = simplifiedWithQualifiers[property]
        propertyValues.should.be.an.Array()
        for (let [index, valueObj] of propertyValues.entries()) {
          valueObj.should.be.an.Object()
          let value = simplified[property][index]
          valueObj.value.should.equal(value)
          valueObj.qualifiers.should.be.an.Object()
        }
      }
      done()
    })

    it('should include prefixes in qualifiers claims', done => {
      const simplifiedWithQualifiers = simplifyClaims(Q646148.claims, 'wd', 'wdt', true)
      simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })

  describe('simplifyPropertyClaims', () => {
    it('should pass entity and property prefixes down', done => {
      simplifyPropertyClaims(Q2112.claims.P190, 'wd')[0].should.equal('wd:Q207614')
      simplifyPropertyClaims(Q2112.claims.P123456789, null, 'wdt')[0].should.equal('P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', done => {
      const simplified = simplifyPropertyClaims(Q571.claims.P279)
      const simplifiedWithQualifiers = simplifyPropertyClaims(Q571.claims.P279, null, null, true)
      simplifiedWithQualifiers.should.be.an.Array()
      for (let [index, valueObj] of simplifiedWithQualifiers.entries()) {
        valueObj.should.be.an.Object()
        let value = simplified[index]
        valueObj.value.should.equal(value)
        valueObj.qualifiers.should.be.an.Object()
      }
      done()
    })

    it('should include prefixes in qualifiers claims', done => {
      const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, 'wd', 'wdt', true)
      simplifiedWithQualifiers[1].qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers[1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })

  describe('simplifyClaim', () => {
    it('should return prefixed entity ids if passed an entity prefix', done => {
      const simplified = simplifyClaim(Q2112.claims.P190[0])
      simplified.should.equal('Q207614')
      const simplified2 = simplifyClaim(Q2112.claims.P190[0], 'wd')
      simplified2.should.equal('wd:Q207614')
      const simplified3 = simplifyClaim(Q2112.claims.P190[0], 'wd:')
      simplified3.should.equal('wd::Q207614')
      const simplified4 = simplifyClaim(Q2112.claims.P190[0], 'wdbla')
      simplified4.should.equal('wdbla:Q207614')
      done()
    })

    it('should return prefixed property ids if passed a property prefix', done => {
      simplifyClaim(Q2112.claims.P123456789[0]).should.equal('P207614')
      simplifyClaim(Q2112.claims.P123456789[0], null).should.equal('P207614')
      simplifyClaim(Q2112.claims.P123456789[0], null, 'wdt').should.equal('P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', done => {
      const simplified = simplifyClaim(Q571.claims.P279[0])
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P279[0], null, null, true)
      simplifiedWithQualifiers.value.should.equal(simplified)
      simplifiedWithQualifiers.qualifiers.should.be.an.Object()
      done()
    })

    it('should include qualifiers when called with keepQualifiers=true', done => {
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], null, null, true)
      simplifiedWithQualifiers.qualifiers.P973.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P973[0].should.equal('http://mappings.dbpedia.org/index.php/OntologyClass:Book')
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11T00:00:00.000Z')
      done()
    })

    it('should include prefixes in qualifiers claims', done => {
      const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], 'wd', 'wdt', true)
      simplifiedWithQualifiers.qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers.qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })
})
