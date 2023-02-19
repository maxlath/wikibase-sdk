// @ts-nocheck
import 'should'
import { simplifyForms, simplifyForm } from '../src/helpers/simplify_forms.js'
import { readJsonFile } from './lib/utils.js'

const L525 = readJsonFile('./tests/data/L525.json')

describe('simplify.form', () => {
  it('should reject an object that isnt a form', () => {
    simplifyForm.bind(null, {}).should.throw('invalid form object')
  })

  it('should simplify a form', () => {
    const simplifiedForm = simplifyForm(L525.forms[0])
    simplifiedForm.representations.fr.should.equal('maisons')
    simplifiedForm.grammaticalFeatures[0].should.equal('Q146786')
    simplifiedForm.claims.should.deepEqual({ P443: [ 'LL-Q150 (fra)-0x010C-maisons.wav' ] })
  })

  it('should pass down options', () => {
    const simplifiedForm = simplifyForm(L525.forms[0], { keepIds: true })
    simplifiedForm.representations.fr.should.equal('maisons')
    simplifiedForm.grammaticalFeatures[0].should.equal('Q146786')
    simplifiedForm.claims.should.deepEqual({
      P443: [
        {
          id: 'L525-F1$079bdca7-5130-4f9f-bac9-e8d032c38263',
          value: 'LL-Q150 (fra)-0x010C-maisons.wav',
        },
      ],
    })
  })
})

describe('simplify.forms', () => {
  it('should simplify forms', () => {
    const simplifiedForms = simplifyForms(L525.forms)
    simplifiedForms.should.be.an.Array()
    simplifiedForms.should.deepEqual(L525.forms.map(simplifyForm))
  })

  it('should pass down options', () => {
    const simplifiedForms = simplifyForms(L525.forms, { keepIds: true })
    simplifiedForms.should.be.an.Array()
    simplifiedForms[0].claims.P443[0].id.should.equal('L525-F1$079bdca7-5130-4f9f-bac9-e8d032c38263')
  })
})
