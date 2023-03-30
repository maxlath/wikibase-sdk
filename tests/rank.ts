import { cloneDeep } from 'lodash-es'
import should from 'should'
import { truthyClaims, truthyPropertyClaims } from '../src/helpers/rank.js'
import { readJsonFile } from './lib/utils.js'

const Q4115189 = readJsonFile('./tests/data/Q4115189.json')

describe('truthyClaims', () => {
  it('should filter-out non-truthy claims', () => {
    const Q4115189Claims = cloneDeep(Q4115189.claims)
    should(Q4115189Claims.P135.length).equal(3)
    const truthyOnly = truthyClaims(Q4115189Claims)
    should(truthyOnly.P135.length).equal(1)
    // @ts-expect-error
    should(truthyOnly.P135[0].mainsnak.datavalue.value.id).equal('Q2044250')
  })
})

describe('truthyPropertyClaims', () => {
  it('should filter-out non-truthy property claims', () => {
    const Q4115189Claims = cloneDeep(Q4115189.claims)
    should(Q4115189Claims.P135.length).equal(3)
    const truthyOnly = truthyPropertyClaims(Q4115189Claims.P135)
    should(truthyOnly.length).equal(1)
    // @ts-expect-error
    should(truthyOnly[0].mainsnak.datavalue.value.id).equal('Q2044250')
  })
})
