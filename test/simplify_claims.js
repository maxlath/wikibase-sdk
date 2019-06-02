const should = require('should')
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
const Q1 = require('./data/Q1.json')
const oldClaimFormat = require('./data/old_claim_format.json')
const lexemeClaim = require('./data/lexeme_claim.json')
const emptyValues = require('./data/empty_values.json')

const { simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('../lib/helpers/simplify_claims')

describe('simplifyClaims', () => {
  it('env', done => {
    Q571.should.be.an.Object()
    Q571.claims.should.be.ok()
    Q4132785.should.be.an.Object()
    Q4132785.claims.P577[0].should.be.ok()
    done()
  })

  it('should return an object', done => {
    simplifyClaims(Q571.claims).should.be.an.Object()
    done()
  })

  it('should not mutate the original object', done => {
    const simplified = simplifyClaims(Q571.claims)
    simplified.should.not.equal(Q571.claims)
    simplified.P487.should.not.equal(Q571.claims.P487)
    done()
  })

  it('should return an object of same length', done => {
    const originalLength = Object.keys(Q571.claims).length
    const simplified = simplifyClaims(Q571.claims)
    const newLength = Object.keys(simplified).length
    newLength.should.equal(originalLength)
    done()
  })

  it('should return an indexed collection of arrays', done => {
    const simplified = simplifyClaims(Q571.claims)
    for (let key in simplified) {
      simplified[key].should.be.an.Array()
    }
    done()
  })

  it('should pass entity and property prefixes down', done => {
    const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd' })
    simplified.P190[0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, { propertyPrefix: 'wdt' })
    simplified2['wdt:P123456789'][0].should.equal('P207614')
    done()
  })

  it('should return prefixed properties if passed a property prefix', done => {
    const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt' })
    simplified['wdt:P190'].should.be.an.Array()
    simplified['wdt:P190'][0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, { propertyPrefix: 'wdt' })
    simplified2['wdt:P123456789'][0].should.equal('P207614')
    done()
  })

  it('should return the correct value when called with keepQualifiers=true', done => {
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

  it('should include prefixes in qualifiers claims', done => {
    const simplifiedWithQualifiers = simplifyClaims(Q646148.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers['wdt:P39'][1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })
})

describe('simplifyPropertyClaims', () => {
  it('should return an arrays', done => {
    const simplified = simplifyPropertyClaims(Q571.claims.P487)
    simplified.should.be.an.Array()
    done()
  })

  it('should not mutate the original array', done => {
    const simplified = simplifyPropertyClaims(Q571.claims.P487)
    simplified.should.not.equal(Q571.claims.P487)
    simplified[0].should.not.equal(Q571.claims.P487[0])
    done()
  })

  it('should keep only non-null values', done => {
    const simplified = simplifyPropertyClaims(Q22002395.claims.P50)
    // Q22002395 P50 has 2 values with "snaktype": "somevalue"
    // that should be removed
    _.every(simplified, qid => qid != null).should.equal(true)
    done()
  })

  it('should deduplicated values', done => {
    const { P50 } = Q22002395.claims
    const claimsWithDuplicates = P50.concat(P50)
    const simplified = simplifyPropertyClaims(claimsWithDuplicates)
    while (simplified.length > 0) {
      let nextValue = simplified.pop()
      simplified.includes(nextValue).should.be.false()
    }
    done()
  })

  it('should pass entity and property prefixes down', done => {
    const simplified = simplifyPropertyClaims(Q2112.claims.P190, { entityPrefix: 'wd' })
    simplified[0].should.equal('wd:Q207614')
    const simplified2 = simplifyPropertyClaims(Q2112.claims.P123456789, { entityPrefix: 'a', propertyPrefix: 'b' })
    simplified2[0].should.equal('a:P207614')
    done()
  })

  it('should return the correct value when called with keepQualifiers=true', done => {
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

  it('should include prefixes in qualifiers claims', done => {
    const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'].should.be.an.Array()
    simplifiedWithQualifiers[1].qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
    done()
  })

  it('construct entity ids for old dump format', done => {
    const simplified = simplifyPropertyClaims(oldClaimFormat)
    simplified.length.should.equal(2)
    simplified[0].should.equal('Q123')
    simplified[1].should.equal('P123')
    done()
  })

  it('should tolerate empty inputs', done => {
    const simplified = simplifyPropertyClaims()
    simplified.should.be.an.Array()
    simplified.length.should.equal(0)
    const simplified2 = simplifyPropertyClaims([])
    simplified2.should.be.an.Array()
    simplified2.length.should.equal(0)
    done()
  })

  describe('ranks', () => {
    it('should return only truthy statements by default', done => {
      const simplified = simplifyPropertyClaims(Q4115189.claims.P135)
      simplified.length.should.equal(1)
      simplified[0].should.equal('Q2044250')
      done()
    })

    it('should also return non-truthy statements if requested', done => {
      const options = { keepNonTruthy: true }
      const simplified = simplifyPropertyClaims(Q4115189.claims.P135, options)
      simplified.length.should.equal(3)
      done()
    })

    it('should keep ranks', done => {
      simplifyPropertyClaims(Q4115189.claims.P135, { keepRanks: true })
      .should.deepEqual([
        { value: 'Q2044250', rank: 'preferred' }
      ])
      simplifyPropertyClaims(Q4115189.claims.P135, { keepRanks: true, keepNonTruthy: true })
      .should.deepEqual([
        { value: 'Q213454', rank: 'deprecated' },
        { value: 'Q2044250', rank: 'preferred' },
        { value: 'Q5843', rank: 'normal' }
      ])
      done()
    })
  })

  describe('empty values', () => {
    it('should not filter-out empty values if given a placeholder value', done => {
      simplifyPropertyClaims(emptyValues.claims.P3984).length.should.equal(1)
      simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-' }).length.should.equal(2)
      simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: null }).length.should.equal(2)
      simplifyPropertyClaims(emptyValues.claims.P3984, { somevalueValue: '?' }).length.should.equal(2)
      simplifyPropertyClaims(emptyValues.claims.P3984, { somevalueValue: null }).length.should.equal(2)
      simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: null, somevalueValue: null }).length.should.equal(3)
      simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-', somevalueValue: '?' }).length.should.equal(3)
      simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-', somevalueValue: '?' }).should.deepEqual([ '-', '?', 'bacasable' ])
      done()
    })

    it('should keep snaktype if requested', done => {
      simplifyPropertyClaims(emptyValues.claims.P3984, { keepSnaktypes: true }).should.deepEqual([
        { value: undefined, snaktype: 'novalue' },
        { value: undefined, snaktype: 'somevalue' },
        { value: 'bacasable', snaktype: 'value' }
      ])
      simplifyPropertyClaims(emptyValues.claims.P3984, {
        keepSnaktypes: true,
        novalueValue: '-',
        somevalueValue: '?'
      })
      .should.deepEqual([
        { value: '-', snaktype: 'novalue' },
        { value: '?', snaktype: 'somevalue' },
        { value: 'bacasable', snaktype: 'value' }
      ])
      done()
    })

    it('should not filter-out empty values if requested as object values', done => {
      simplifyPropertyClaims(emptyValues.claims.P3984, { keepQualifiers: true }).should.deepEqual([
        { value: undefined, qualifiers: {} },
        { value: undefined, qualifiers: {} },
        { value: 'bacasable', qualifiers: {} }
      ])
      simplifyPropertyClaims(emptyValues.claims.P3984, { keepReferences: true }).should.deepEqual([
        { value: undefined, references: [] },
        { value: undefined, references: [] },
        { value: 'bacasable', references: [] }
      ])
      simplifyPropertyClaims(emptyValues.claims.P3984, { keepIds: true }).should.deepEqual([
        { value: undefined, id: 'Q4115189$c973aadc-48d3-5ac2-45fc-9f34a51ebdf6' },
        { value: undefined, id: 'Q4115189$db1940f1-41bd-ad24-8fbc-20bc6465a35f' },
        { value: 'bacasable', id: 'Q4115189$5c85ec5e-48f5-716d-8944-c4364693e406' }
      ])
      simplifyPropertyClaims(emptyValues.claims.P3984, { keepTypes: true }).should.deepEqual([
        { value: undefined, type: 'external-id' },
        { value: undefined, type: 'external-id' },
        { value: 'bacasable', type: 'external-id' }
      ])
      done()
    })
  })

  it('should use the placeholder value for empty values in object values', done => {
    simplifyPropertyClaims(emptyValues.claims.P3984, {
      keepQualifiers: true,
      novalueValue: '-',
      somevalueValue: '?'
    })
    .should.deepEqual([
      { value: '-', qualifiers: {} },
      { value: '?', qualifiers: {} },
      { value: 'bacasable', qualifiers: {} }
    ])
    done()
  })
})

describe('simplifyClaim', () => {
  describe('datatypes', () => {
    it('should return a url for datatype url', done => {
      const simplified = simplifyClaim(Q328212.claims.P856[0])
      simplified.should.equal('http://veronicarothbooks.blogspot.com')
      done()
    })

    it('should return simplify globecoordinate as a latLng array', done => {
      const simplified = simplifyClaim(Q2112.claims.P625[0])
      simplified.should.be.an.Array()
      simplified[0].should.equal(52.016666666667)
      simplified[1].should.equal(8.5166666666667)
      done()
    })

    it('should support geo-shape', done => {
      simplifyClaim(Q217447.claims.P3896[0]).should.equal('Data:Rky/1277_Verlan_teollisuusympäristö.map')
      done()
    })

    it('should support tabular-data', done => {
      simplifyClaim(Q271094.claims.P4179[0]).should.equal('Data:Taipei Neihu District Population.tab')
      done()
    })

    it('should support lexemes', done => {
      simplifyClaim(lexemeClaim).should.equal('L397')
      done()
    })

    it('should support musical-notation', done => {
      simplifyClaim(Q4115189.claims.P6604[0]).should.equal('\\relative { c d e f g e }')
      done()
    })
  })

  describe('prefixes', () => {
    it('should return prefixed entity ids if passed an entity prefix', done => {
      const claim = Q2112.claims.P190[0]
      simplifyClaim(claim).should.equal('Q207614')
      simplifyClaim(claim, { entityPrefix: 'wd' }).should.equal('wd:Q207614')
      simplifyClaim(claim, { entityPrefix: 'wd:' }).should.equal('wd::Q207614')
      simplifyClaim(claim, { entityPrefix: 'wdbla' }).should.equal('wdbla:Q207614')
      done()
    })

    it('should not apply property prefixes to property claim values', done => {
      const claim = Q2112.claims.P123456789[0]
      simplifyClaim(claim).should.equal('P207614')
      simplifyClaim(claim, { entityPrefix: null }).should.equal('P207614')
      simplifyClaim(claim, { propertyPrefix: 'wdt' }).should.equal('P207614')
      simplifyClaim(claim, { propertyPrefix: 'wdt:' }).should.equal('P207614')
      simplifyClaim(claim, { propertyPrefix: 'wdtbla' }).should.equal('P207614')
      simplifyClaim(claim, { entityPrefix: 'wd' }).should.equal('wd:P207614')
      simplifyClaim(claim, { entityPrefix: 'wd:' }).should.equal('wd::P207614')
      simplifyClaim(claim, { entityPrefix: 'wdbla' }).should.equal('wdbla:P207614')
      done()
    })
  })

  describe('keepTypes', () => {
    it('should return the correct value when called with keepQualifiers=true', done => {
      const simplified = simplifyClaim(Q2112.claims.P190[0], { keepTypes: true })
      simplified.should.deepEqual({ value: 'Q207614', type: 'wikibase-item' })
      done()
    })
  })

  describe('qualifiers', () => {
    it('should return the correct value when called with keepQualifiers=true', done => {
      const simplified = simplifyClaim(Q571.claims.P279[0])
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P279[0], { keepQualifiers: true })
      simplifiedWithQualifiers.value.should.equal(simplified)
      simplifiedWithQualifiers.qualifiers.should.be.an.Object()
      done()
    })

    it('should include qualifiers when called with keepQualifiers=true', done => {
      const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true })
      simplifiedWithQualifiers.qualifiers.P973.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P973[0].should.equal('http://mappings.dbpedia.org/index.php/OntologyClass:Book')
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11T00:00:00.000Z')
      done()
    })

    it('should include prefixes in qualifiers claims', done => {
      const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true })
      simplifiedWithQualifiers.qualifiers['wdt:P1365'].should.be.an.Array()
      simplifiedWithQualifiers.qualifiers['wdt:P1365'][0].should.equal('wd:Q312881')
      done()
    })

    it('should include types in qualifiers claims', done => {
      const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { keepTypes: true, keepQualifiers: true })
      simplifiedWithQualifiers.qualifiers['P1365'].should.be.an.Array()
      simplifiedWithQualifiers.qualifiers['P1365'][0].should.deepEqual({ value: 'Q312881', type: 'wikibase-item' })
      done()
    })

    it('should respect timeConverter for qualifiers claims', done => {
      let simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'iso' })
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11T00:00:00.000Z')
      simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'epoch' })
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal(1433980800000)
      simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'simple-day' })
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('2015-06-11')
      simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'none' })
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('+2015-06-11T00:00:00Z')
      simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: v => `foo/${v.time}/${v.precision}/bar` })
      simplifiedWithQualifiers.qualifiers.P813.should.be.an.Array()
      simplifiedWithQualifiers.qualifiers.P813[0].should.equal('foo/+2015-06-11T00:00:00Z/11/bar')
      done()
    })
  })

  describe('references', () => {
    it('should return the correct value when called with keepReferences=true', done => {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true })
      simplifiedWithReferences.value.should.equal(simplified)
      simplifiedWithReferences.references.should.be.an.Object()
      done()
    })

    it('should include references when called with keepReferences=true', done => {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true })
      simplifiedWithReferences.references[0].P248.should.be.an.Array()
      simplifiedWithReferences.references[0].P248[0].should.equal('Q54919')
      simplifiedWithReferences.references[0].P813.should.be.an.Array()
      simplifiedWithReferences.references[0].P813[0].should.equal('2015-08-02T00:00:00.000Z')
      done()
    })

    it('should include prefixes in references claims', done => {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepReferences: true })
      simplifiedWithReferences.references[0]['wdt:P248'].should.be.an.Array()
      simplifiedWithReferences.references[0]['wdt:P248'][0].should.equal('wd:Q54919')
      done()
    })
  })

  describe('ids', () => {
    it('should return the correct value when called with keepIds=true', done => {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true })
      simplifiedWithIds.value.should.equal(simplified)
      simplifiedWithIds.id.should.be.a.String()
      done()
    })

    it('should include ids when called with keepReferences=true', done => {
      const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true })
      simplifiedWithIds.id.should.equal('Q2112$ECB9E5BB-B2E1-4E77-8CEE-4E9F4938EB86')
      done()
    })
  })

  describe('hashes', () => {
    it('should return the correct value when called with keepHashes=true', done => {
      const simplified = simplifyClaim(Q2112.claims.P214[0])
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepQualifiers: true, keepHashes: true })
      simplifiedWithReferences.value.should.equal(simplified)
      done()
    })

    it('should include references hashes when called with keepHashes=true', done => {
      const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepHashes: true })
      simplifiedWithReferences.references[0].snaks.P248.should.be.an.Array()
      simplifiedWithReferences.references[0].hash.should.equal('d6b4bc80e47def2fab91836d81e1db62c640279c')
      simplifiedWithReferences.references[0].snaks.P248[0].should.equal('Q54919')
      simplifiedWithReferences.references[0].snaks.P813.should.be.an.Array()
      simplifiedWithReferences.references[0].snaks.P813[0].should.equal('2015-08-02T00:00:00.000Z')
      done()
    })

    it('should include qualifiers hashes when called with keepHashes=true', done => {
      const simplifiedWithQualifiers = simplifyPropertyClaims(Q2112.claims.P190, { keepQualifiers: true, keepHashes: true })
      simplifiedWithQualifiers[1].qualifiers.P580[0].value.should.equal('1953-01-01T00:00:00.000Z')
      simplifiedWithQualifiers[1].qualifiers.P580[0].hash.should.equal('3d22f4dffba1ac6f66f521ea6bea924e46df4129')
      done()
    })
  })

  describe('rich values', () => {
    it('should keep monolingual rich values', done => {
      const options = { keepRichValues: true }
      const simplified = simplifyClaim(Q328212.claims.P1477[0], options)
      simplified.text.should.equal('Veronica Roth')
      simplified.language.should.equal('es')
      done()
    })

    it('should keep quantity rich values', done => {
      const options = { keepRichValues: true }
      const simplified = simplifyClaim(Q2112.claims.P2044[0], options)
      simplified.amount.should.equal(118)
      simplified.unit.should.equal('Q11573')
      simplified.upperBound.should.equal(119)
      simplified.lowerBound.should.equal(117)
      done()
    })
  })

  describe('time converter', () => {
    it('should use a custom time converter when one is set', done => {
      const claim = Q646148.claims.P569[0]
      const simplifyTimeClaim = timeConverter => simplifyClaim(claim, { timeConverter })
      simplifyTimeClaim().should.equal('1939-11-08T00:00:00.000Z')
      simplifyTimeClaim('iso').should.equal('1939-11-08T00:00:00.000Z')
      simplifyTimeClaim('epoch').should.equal(-951436800000)
      simplifyTimeClaim('simple-day').should.equal('1939-11-08')
      simplifyTimeClaim('none').should.equal('+1939-11-08T00:00:00Z')
      const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`
      simplifyTimeClaim(timeConverterFn).should.equal('foo/+1939-11-08T00:00:00Z/11/bar')
      done()
    })

    it('should be able to parse long dates', done => {
      const claim = Q1.claims.P580[0]
      const simplifyTimeClaim = timeConverter => simplifyClaim(claim, { timeConverter })
      simplifyTimeClaim().should.equal('-13798000000-01-01T00:00:00Z')
      simplifyTimeClaim('none').should.equal('-13798000000-00-00T00:00:00Z')
      simplifyTimeClaim('iso').should.equal('-13798000000-01-01T00:00:00Z')
      simplifyTimeClaim('simple-day').should.equal('-13798000000')
      const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`
      simplifyTimeClaim(timeConverterFn).should.equal('foo/-13798000000-00-00T00:00:00Z/3/bar')
      // Can't be supported due to JS large numbers limitations;
      // 13798000000*365.25*24*60*60*1000 is too big
      // timeClaim('epoch').should.equal('-13798000000-00-00T00:00:00Z')
      done()
    })
  })

  describe('empty values', () => {
    it('should return the desired novalueValue', done => {
      const noValueClaim = emptyValues.claims.P3984[0]
      should(simplifyClaim(noValueClaim)).not.be.ok()
      simplifyClaim(noValueClaim, { novalueValue: '-' }).should.equal('-')
      simplifyClaim(noValueClaim, { novalueValue: '' }).should.equal('')
      done()
    })

    it('should return the desired somevalueValue', done => {
      const someValueClaim = emptyValues.claims.P3984[1]
      should(simplifyClaim(someValueClaim)).not.be.ok()
      simplifyClaim(someValueClaim, { somevalueValue: '?' }).should.equal('?')
      simplifyClaim(someValueClaim, { somevalueValue: '' }).should.equal('')
      done()
    })

    it('should accept null as a possible value', done => {
      const noValueClaim = emptyValues.claims.P3984[0]
      should(simplifyClaim(noValueClaim, { novalueValue: null }) === null).be.true()
      done()
    })

    it('should return rich values for null values if requested', done => {
      simplifyClaim(emptyValues.claims.P3984[0], { keepQualifiers: true }).should.have.property('qualifiers')
      simplifyClaim(emptyValues.claims.P3984[0], { keepReferences: true }).should.have.property('references')
      simplifyClaim(emptyValues.claims.P3984[0], { keepIds: true }).should.have.property('id')
      simplifyClaim(emptyValues.claims.P3984[0], { keepTypes: true }).should.have.property('type')
      done()
    })
  })

  describe('keep all', () => {
    it('should activate all keep options', done => {
      const simplified = simplifyClaim(Q2112.claims.P214[0], { keepAll: true })
      simplified.value.should.be.a.String()
      simplified.id.should.be.a.String()
      simplified.type.should.be.a.String()
      simplified.rank.should.be.a.String()
      simplified.snaktype.should.be.a.String()
      simplified.qualifiers.should.be.an.Object()
      simplified.references.should.be.an.Array()
      simplified.references[0].should.be.an.Object()
      simplified.references[0].hash.should.be.a.String()
      done()
    })

    it('should be overriden by other flags', done => {
      const simplified = simplifyClaim(Q2112.claims.P214[0], { keepAll: true, keepTypes: false })
      simplified.value.should.be.a.String()
      simplified.id.should.be.a.String()
      should(simplified.type).not.be.ok()
      simplified.rank.should.be.a.String()
      simplified.snaktype.should.be.a.String()
      simplified.qualifiers.should.be.an.Object()
      simplified.references.should.be.an.Array()
      simplified.references[0].should.be.an.Object()
      simplified.references[0].hash.should.be.a.String()
      done()
    })
  })
})
