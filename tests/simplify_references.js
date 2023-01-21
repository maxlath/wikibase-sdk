require('should')
const { simplifyReferences } = require('../lib/helpers/simplify_claims')
const Q217447 = require('./data/Q217447.json')

describe('simplifyReferences', () => {
  it('should simplify references', () => {
    simplifyReferences(Q217447.claims.P131[0].references)
    .should.deepEqual([ { P248: [ 'Q3485482' ] } ])
  })
})
