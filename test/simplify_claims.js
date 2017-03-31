require('should')
const _ = require('lodash')
const Q571 = require('./data/Q571.json')
const Q646148 = require('./data/Q646148.json')
const Q4132785 = require('./data/Q4132785.json')
const Q328212 = require('./data/Q328212.json')
const Q22002395 = require('./data/Q22002395.json')
const Q2112 = require('./data/Q2112.json')

const { simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('../lib/helpers/simplify_claims')

describe('simplifyClaims', function () {
  it('env', function (done) {
    Q571.should.be.an.Object()
    Q571.claims.should.be.ok()
    Q4132785.should.be.an.Object()
    Q4132785.claims.P577[0].should.be.ok()
    done()
  })

  it('should return an object', function (done) {
    simplifyClaims(Q571.claims).should.be.an.Object()
    done()
  })

  it('should not mutate the original object', function (done) {
    const simplified = simplifyClaims(Q571.claims)
    simplified.should.not.equal(Q571.claims)
    simplified.P487.should.not.equal(Q571.claims.P487)
    done()
  })

  it('should return an object of same length', function (done) {
    const originalLength = Object.keys(Q571.claims).length
    const simplified = simplifyClaims(Q571.claims)
    const newLength = Object.keys(simplified).length
    newLength.should.equal(originalLength)
    done()
  })

  it('should return an indexed collection of arrays', function (done) {
    const simplified = simplifyClaims(Q571.claims)
    for (let key in simplified) {
      simplified[key].should.be.an.Array()
    }
    done()
  })

  it('should pass entity and property prefixes down', function (done) {
    const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd' })
    simplified.P190[0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, { propertyPrefix: 'wdt' })
    simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
    done()
  })

  it('should return prefixed properties if passed a property prefix', function (done) {
    const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt' })
    simplified['wdt:P190'].should.be.an.Array()
    simplified['wdt:P190'][0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, { propertyPrefix: 'wdt' })
    simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
    done()
  })

  it('should return the correct value when called with keepQualifiers=true', function (done) {
    const simplified = simplifyClaims(Q571.claims)
    const simplifiedWithQualifiers = simplifyClaims(Q571.claims, { keepQualifiers: true })
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

  it('should include prefixes in qualifiers claims', function (done) {
    const simplifiedWithQualifiers = simplifyClaims(Q646148.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })
})

describe('simplifyPropertyClaims', function () {
  it('should return an arrays', function (done) {
    const simplified = simplifyPropertyClaims(Q571.claims.P487)
    simplified.should.be.an.Array()
    done()
  })

  it('should not mutate the original array', function (done) {
    const simplified = simplifyPropertyClaims(Q571.claims.P487)
    simplified.should.not.equal(Q571.claims.P487)
    simplified[0].should.not.equal(Q571.claims.P487[0])
    done()
  })

  it('should keep only non-null values', function (done) {
    const simplified = simplifyPropertyClaims(Q22002395.claims.P50)
    // Q22002395 P50 has 2 values with "snaktype": "somevalue"
    // that should be removed
    _.all(simplified, (qid) => qid != null).should.equal(true)
    done()
  })

  it('should pass entity and property prefixes down', function (done) {
    const simplified = simplifyPropertyClaims(Q2112.claims.P190, { entityPrefix: 'wd' })
    simplified[0].should.equal('wd:Q207614')
    const simplified2 = simplifyPropertyClaims(Q2112.claims.P123456789, { propertyPrefix: 'wdt' })
    simplified2[0].should.equal('wdt:P207614')
    done()
  })

  it('should return the correct value when called with keepQualifiers=true', function (done) {
    const simplified = simplifyPropertyClaims(Q571.claims.P279)
    const simplifiedWithQualifiers = simplifyPropertyClaims(Q571.claims.P279, { keepQualifiers: true })
    simplifiedWithQualifiers.should.be.an.Array()
    for (let [index, valueObj] of simplifiedWithQualifiers.entries()) {
      valueObj.should.be.an.Object()
      let value = simplified[index]
      valueObj.value.should.equal(value)
      valueObj.qualifiers.should.be.an.Object()
    }
    done()
  })

  it('should include prefixes in qualifiers claims', function (done) {
    const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })
})

describe('simplifyClaim', function () {
  it('should return a url for datatype url', function (done) {
    const simplified = simplifyClaim(Q328212.claims.P856[0])
    simplified.should.equal('http://veronicarothbooks.blogspot.com')
    done()
  })

  it('should return simplify globecoordinate as a latLng array', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P625[0])
    simplified.should.be.an.Array()
    simplified[0].should.equal(52.016666666667)
    simplified[1].should.equal(8.5166666666667)
    done()
  })

  it('should return prefixed entity ids if passed an entity prefix', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P190[0])
    simplified.should.equal('Q207614')
    const simplified2 = simplifyClaim(Q2112.claims.P190[0], { entityPrefix: 'wd' })
    simplified2.should.equal('wd:Q207614')
    const simplified3 = simplifyClaim(Q2112.claims.P190[0], { entityPrefix: 'wd:' })
    simplified3.should.equal('wd::Q207614')
    const simplified4 = simplifyClaim(Q2112.claims.P190[0], { entityPrefix: 'wdbla' })
    simplified4.should.equal('wdbla:Q207614')
    done()
  })

  it('should return prefixed property ids if passed a property prefix', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P123456789[0])
    simplified.should.equal('P207614')
    const simplified2 = simplifyClaim(Q2112.claims.P123456789[0], { entityPrefix: null })
    simplified2.should.equal('P207614')
    const simplified3 = simplifyClaim(Q2112.claims.P123456789[0], { propertyPrefix: 'wdt' })
    simplified3.should.equal('wdt:P207614')
    const simplified4 = simplifyClaim(Q2112.claims.P123456789[0], { propertyPrefix: 'wdt:' })
    simplified4.should.equal('wdt::P207614')
    const simplified5 = simplifyClaim(Q2112.claims.P123456789[0], { propertyPrefix: 'wdtbla' })
    simplified5.should.equal('wdtbla:P207614')
    done()
  })

  it('should return the correct value when called with keepQualifiers=true', function (done) {
    const simplified = simplifyClaim(Q571.claims.P279[0])
    const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P279[0], { keepQualifiers: true })
    simplifiedWithQualifiers.value.should.equal(simplified)
    simplifiedWithQualifiers.qualifiers.should.be.an.Object()
    done()
  })

  it('should include qualifiers when called with keepQualifiers=true', function (done) {
    const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true })
    simplifiedWithQualifiers.qualifiers.P973.should.be.an.Array()
    simplifiedWithQualifiers.qualifiers.P973[0].should.equal('http://mappings.dbpedia.org/index.php/OntologyClass:Book')
    simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
    simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11T00:00:00.000Z')
    done()
  })

  it('should include prefixes in qualifiers claims', function (done) {
    const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers.qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers.qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })

  it('should use a custom time converter when one is set', function (done) {
    const timeClaim = (converter) => {
      return simplifyClaim(Q646148.claims.P569[0], { timeConverter: converter })
    }
    timeClaim().should.equal('1939-11-08T00:00:00.000Z')
    timeClaim('iso').should.equal('1939-11-08T00:00:00.000Z')
    timeClaim('epoch').should.equal(-951436800000)
    timeClaim('none').should.equal('+1939-11-08T00:00:00Z')
    done()
  })
})

describe('simplify claims functions legacy options interface', function () {
  describe('simplifyClaims', function () {
    it('should pass entity and property prefixes down', function (done) {
      const simplified = simplifyClaims(Q2112.claims, 'wd')
      simplified.P190[0].should.equal('wd:Q207614')
      const simplified2 = simplifyClaims(Q2112.claims, null, 'wdt')
      simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
      done()
    })

    it('should return prefixed properties if passed a property prefix', function (done) {
      const simplified = simplifyClaims(Q2112.claims, 'wd', 'wdt')
      simplified['wdt:P190'].should.be.an.Array()
      simplified['wdt:P190'][0].should.equal('wd:Q207614')
      const simplified2 = simplifyClaims(Q2112.claims, null, 'wdt')
      simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', function (done) {
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

    it('should include prefixes in qualifiers claims', function (done) {
      const simplifiedWithQualifiers = simplifyClaims(Q646148.claims, 'wd', 'wdt', true)
      simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })
  describe('simplifyPropertyClaims', function () {
    it('should pass entity and property prefixes down', function (done) {
      const simplified = simplifyPropertyClaims(Q2112.claims.P190, 'wd')
      simplified[0].should.equal('wd:Q207614')
      const simplified2 = simplifyPropertyClaims(Q2112.claims.P123456789, null, 'wdt')
      simplified2[0].should.equal('wdt:P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', function (done) {
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

    it('should include prefixes in qualifiers claims', function (done) {
      const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, 'wd', 'wdt', true)
      simplifiedWithQualifiers[1].qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers[1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })
  describe('simplifyClaim', function () {
    it('should return prefixed entity ids if passed an entity prefix', function (done) {
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

    it('should return prefixed property ids if passed a property prefix', function (done) {
      const simplified = simplifyClaim(Q2112.claims.P123456789[0])
      simplified.should.equal('P207614')
      const simplified2 = simplifyClaim(Q2112.claims.P123456789[0], null)
      simplified2.should.equal('P207614')
      const simplified3 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdt')
      simplified3.should.equal('wdt:P207614')
      const simplified4 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdt:')
      simplified4.should.equal('wdt::P207614')
      const simplified5 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdtbla')
      simplified5.should.equal('wdtbla:P207614')
      done()
    })

    it('should return the correct value when called with keepQualifiers=true', function (done) {
      const simplified = simplifyClaim(Q571.claims.P279[0])
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P279[0], null, null, true)
      simplifiedWithQualifiers.value.should.equal(simplified)
      simplifiedWithQualifiers.qualifiers.should.be.an.Object()
      done()
    })

    it('should include qualifiers when called with keepQualifiers=true', function (done) {
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], null, null, true)
      simplifiedWithQualifiers.qualifiers.P973.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P973[0].should.equal('http://mappings.dbpedia.org/index.php/OntologyClass:Book')
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11T00:00:00.000Z')
      done()
    })

    it('should include prefixes in qualifiers claims', function (done) {
      const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], 'wd', 'wdt', true)
      simplifiedWithQualifiers.qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers.qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })
  })
})
