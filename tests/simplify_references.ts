import 'should'
import { simplifyReferences } from '../src/helpers/simplify_claims.js'
import { requireJson } from './lib/utils.js'

const Q217447 = requireJson(import.meta.url, './data/Q217447.json')

describe('simplifyReferences', () => {
  it('should simplify references', () => {
    // @ts-expect-error
    simplifyReferences(Q217447.claims.P131[0].references)
    .should.deepEqual([ { P248: [ 'Q3485482' ] } ])
  })
})
