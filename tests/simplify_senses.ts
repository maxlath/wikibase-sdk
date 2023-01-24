import 'should'
import { simplifySenses, simplifySense } from '../src/helpers/simplify_senses.js'
import { requireJson } from './lib/utils.js'

const L525 = requireJson(import.meta.url, './data/L525.json')

describe('simplify.sense', () => {
  it('should reject an object that isnt a sense', () => {
    simplifySense.bind(null, {}).should.throw('invalid sense object')
  })

  it('should simplify a sense', () => {
    const simplifiedSense = simplifySense(L525.senses[0])
    simplifiedSense.glosses.fr.should.equal("édifice destiné à l'habitation")
    simplifiedSense.claims.should.deepEqual({ P5137: [ 'Q3947' ] })
  })

  it('should pass down options', () => {
    const simplifiedSense = simplifySense(L525.senses[0], { keepIds: true })
    simplifiedSense.glosses.fr.should.equal("édifice destiné à l'habitation")
    simplifiedSense.claims.should.deepEqual({
      P5137: [
        {
          id: 'L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48',
          value: 'Q3947',
        },
      ],
    })
  })
})

describe('simplify.senses', () => {
  it('should simplify senses', () => {
    const simplifiedSenses = simplifySenses(L525.senses)
    simplifiedSenses.should.be.an.Array()
    simplifiedSenses.should.deepEqual(L525.senses.map(simplifySense))
  })

  it('should pass down options', () => {
    const simplifiedSenses = simplifySenses(L525.senses, { keepIds: true })
    simplifiedSenses.should.be.an.Array()
    simplifiedSenses[0].claims.P5137[0].id.should.equal('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48')
  })
})
