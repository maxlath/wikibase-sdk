require('should')
const _ = require('lodash')
const Q571 = require('./data/Q571.json')
const Q646148 = require('./data/Q646148.json')
const Q4132785 = require('./data/Q4132785.json')
const Q328212 = require('./data/Q328212.json')
const Q22002395 = require('./data/Q22002395.json')
const Q2112 = require('./data/Q2112.json')
const Q217447 = require('./data/Q217447.json')
const Q271094 = require('./data/Q271094.json')
const Q4115189 = require('./data/Q4115189.json')
const Q970917 = require('./data/Q970917.json')
const Q1 = require('./data/Q1.json')
const oldClaimFormat = require('./data/old_claim_format.json')

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
    Object.keys(simplifiedWithQualifiers).forEach(property => {
      let propertyValues = simplifiedWithQualifiers[property]
      propertyValues.should.be.an.Array()
      propertyValues.forEach((valueObj, index) => {
        valueObj.should.be.an.Object()
        let value = simplified[property][index]
        valueObj.value.should.equal(value)
        valueObj.qualifiers.should.be.an.Object()
      })
    })
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
    _.every(simplified, (qid) => qid != null).should.equal(true)
    done()
  })

  it('should deduplicated values', function (done) {
    const { P50 } = Q22002395.claims
    const claimsWithDuplicates = P50.concat(P50)
    const simplified = simplifyPropertyClaims(claimsWithDuplicates)
    while (simplified.length > 0) {
      let nextValue = simplified.pop()
      simplified.includes(nextValue).should.be.false()
    }
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
    simplifiedWithQualifiers.forEach((valueObj, index) => {
      valueObj.should.be.an.Object()
      let value = simplified[index]
      valueObj.value.should.equal(value)
      valueObj.qualifiers.should.be.an.Object()
    })
    done()
  })

  it('should include prefixes in qualifiers claims', function (done) {
    const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })

  it('should return only truthy statements by default', function (done) {
    const simplified = simplifyPropertyClaims(Q4115189.claims.P135)
    simplified.length.should.equal(1)
    simplified[0].should.equal('Q2044250')
    done()
  })

  it('should also return non-truthy statements if requested', function (done) {
    const options = { keepNonTruthy: true }
    const simplified = simplifyPropertyClaims(Q4115189.claims.P135, options)
    simplified.length.should.equal(3)
    done()
  })

  it('construct entity ids for old dump format', function (done) {
    const simplified = simplifyPropertyClaims(oldClaimFormat)
    simplified.length.should.equal(2)
    simplified[0].should.equal('Q123')
    simplified[1].should.equal('P123')
    done()
  })

  it('should tolerate empty inputs', function (done) {
    const simplified = simplifyPropertyClaims()
    simplified.should.be.an.Array()
    simplified.length.should.equal(0)
    const simplified2 = simplifyPropertyClaims([])
    simplified2.should.be.an.Array()
    simplified2.length.should.equal(0)
    done()
  })
})

describe('simplifyClaim', function () {
  describe('datatypes', function () {
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

    it('should support geo-shape', function (done) {
      simplifyClaim(Q217447.claims.P3896[0]).should.equal('Data:Rky/1277_Verlan_teollisuusympäristö.map')
      done()
    })

    it('should support tabular-data', function (done) {
      simplifyClaim(Q271094.claims.P4179[0]).should.equal('Data:Taipei Neihu District Population.tab')
      done()
    })
  })

  describe('prefixes', function () {
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
  })

  describe('keepTypes', function () {
    it('should return the correct value when called with keepQualifiers=true', function (done) {
      const simplified = simplifyClaim(Q2112.claims.P190[0], { keepTypes: true })
      simplified.should.deepEqual({ value: 'Q207614', type: 'wikibase-item' })
      done()
    })
  })

  describe('qualifiers', function () {
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

    it('should include types in qualifiers claims', function (done) {
      const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { keepTypes: true, keepQualifiers: true })
      simplifiedWithQualifiers.qualifiers['P1365'].should.be.an.Array()
      simplifiedWithQualifiers.qualifiers['P1365'][0].should.deepEqual({ value: 'Q312881', type: 'wikibase-item' })
      done()
    })
  })

  describe('references', function () {
    it('should return the correct value when called with keepReferences=true', function (done) {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true })
      simplifiedWithReferences.value.should.equal(simplified)
      simplifiedWithReferences.references.should.be.an.Object()
      done()
    })

    it('should include references when called with keepReferences=true', function (done) {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true })
      simplifiedWithReferences.references[0].P248.should.be.an.Array()
      simplifiedWithReferences.references[0].P248[0].should.equal('Q54919')
      simplifiedWithReferences.references[0].P813.should.be.an.Array()
      simplifiedWithReferences.references[0].P813[0].should.equal('2015-08-02T00:00:00.000Z')
      done()
    })

    it('should include prefixes in references claims', function (done) {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepReferences: true })
      simplifiedWithReferences.references[0]['wdt:P248'].should.be.an.Array()
      simplifiedWithReferences.references[0]['wdt:P248'][0].should.equal('wd:Q54919')
      done()
    })
  })

  describe('ids', function () {
    it('should return the correct value when called with keepIds=true', function (done) {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true })
      simplifiedWithIds.value.should.equal(simplified)
      simplifiedWithIds.id.should.be.a.String()
      done()
    })

    it('should include ids when called with keepReferences=true', function (done) {
      const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true })
      simplifiedWithIds.id.should.equal('Q2112$ECB9E5BB-B2E1-4E77-8CEE-4E9F4938EB86')
      done()
    })
  })

  describe('hashes', function () {
    it('should return the correct value when called with keepHashes=true', function (done) {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepQualifiers: true, keepHashes: true })
      simplifiedWithReferences.value.should.equal(simplified)
      done()
    })

    it('should include references hashes when called with keepHashes=true', function (done) {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepHashes: true })
      simplifiedWithReferences.references[0].snaks.P248.should.be.an.Array()
      simplifiedWithReferences.references[0].hash.should.equal('d6b4bc80e47def2fab91836d81e1db62c640279c')
      simplifiedWithReferences.references[0].snaks.P248[0].should.equal('Q54919')
      simplifiedWithReferences.references[0].snaks.P813.should.be.an.Array()
      simplifiedWithReferences.references[0].snaks.P813[0].should.equal('2015-08-02T00:00:00.000Z')
      done()
    })

    it('should include qualifiers hashes when called with keepHashes=true', function (done) {
      const simplifiedWithQualifiers = simplifyPropertyClaims(Q2112.claims.P190, { keepQualifiers: true, keepHashes: true })
      simplifiedWithQualifiers[1].qualifiers.P580[0].value.should.equal('1953-01-01T00:00:00.000Z')
      simplifiedWithQualifiers[1].qualifiers.P580[0].hash.should.equal('3d22f4dffba1ac6f66f521ea6bea924e46df4129')
      done()
    })
  })

  describe('rich values', function () {
    it('should keep monolingual rich values', function (done) {
      const options = { keepRichValues: true }
      const simplified = simplifyClaim(Q328212.claims.P1477[0], options)
      simplified.text.should.equal('Veronica Roth')
      simplified.language.should.equal('es')
      done()
    })

    it('should keep quantity rich values', function (done) {
      const options = { keepRichValues: true }
      const simplified = simplifyClaim(Q2112.claims.P2044[0], options)
      simplified.amount.should.equal(118)
      simplified.unit.should.equal('Q11573')
      simplified.upperBound.should.equal(119)
      simplified.lowerBound.should.equal(117)
      done()
    })
  })

  describe('time converter', function () {
    it('should use a custom time converter when one is set', function (done) {
      const timeClaim = (entity, timeConverter) => {
        return simplifyClaim(entity.claims.P569[0], { timeConverter })
      }
      timeClaim(Q646148).should.equal('1939-11-08T00:00:00.000Z')
      timeClaim(Q646148, 'iso').should.equal('1939-11-08T00:00:00.000Z')
      timeClaim(Q646148, 'epoch').should.equal(-951436800000)
      timeClaim(Q646148, 'simple-day').should.equal('1939-11-08')
      timeClaim(Q646148, 'none').should.equal('+1939-11-08T00:00:00Z')
      // New date format: missing precision units use 01 instead of 00
      timeClaim(Q970917).should.equal('1869-11-01T00:00:00.000Z')
      timeClaim(Q970917, 'iso').should.equal('1869-11-01T00:00:00.000Z')
      timeClaim(Q970917, 'epoch').should.equal(-3160944000000)
      timeClaim(Q970917, 'simple-day').should.equal('1869-11')
      timeClaim(Q970917, 'none').should.equal('+1869-11-01T00:00:00Z')
      done()
    })

    it('should be able to parse long dates', function (done) {
      const timeClaim = timeConverter => {
        return simplifyClaim(Q1.claims.P580[0], { timeConverter })
      }
      timeClaim().should.equal('-13798000000-01-01T00:00:00Z')
      timeClaim('none').should.equal('-13798000000-00-00T00:00:00Z')
      timeClaim('iso').should.equal('-13798000000-01-01T00:00:00Z')
      timeClaim('simple-day').should.equal('-13798000000')
      // Can't be supported due to JS large numbers limitations;
      // 13798000000*365.25*24*60*60*1000 is too big
      // timeClaim('epoch').should.equal('-13798000000-00-00T00:00:00Z')
      done()
    })
  })
})
