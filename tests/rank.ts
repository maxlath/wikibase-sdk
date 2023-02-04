// @ts-nocheck
import 'should'
import { cloneDeep } from 'lodash-es'
import { truthyClaims, truthyPropertyClaims } from '../src/helpers/rank.js'
import { requireJson } from './lib/utils.js'

const Q4115189 = requireJson(import.meta.url, './data/Q4115189.json')

describe('truthyClaims', () => {
  it('should filter-out non-truthy claims', () => {
    const Q4115189Claims = cloneDeep(Q4115189.claims)
    Q4115189Claims.P135.length.should.equal(3)
    const truthyOnly = truthyClaims(Q4115189Claims)
    // @ts-ignore
    truthyOnly.P135.length.should.equal(1)
    // @ts-ignore
    truthyOnly.P135[0].mainsnak.datavalue.value.id.should.equal('Q2044250')
  })
})

describe('truthyPropertyClaims', () => {
  it('should filter-out non-truthy property claims', () => {
    const Q4115189Claims = cloneDeep(Q4115189.claims)
    Q4115189Claims.P135.length.should.equal(3)
    const truthyOnly = truthyPropertyClaims(Q4115189Claims.P135)
    truthyOnly.length.should.equal(1)
    truthyOnly[0].mainsnak.datavalue.value.id.should.equal('Q2044250')
  })
})
