import should from 'should';
import { simplifyForms, simplifyForm } from '../src/helpers/simplify_forms.js';
import { L525 } from './data/L525.js';
describe('simplify.form', () => {
    it('should reject an object that isnt a form', () => {
        // @ts-expect-error isnt a form
        should(() => simplifyForm({})).throw('invalid form object');
    });
    it('should simplify a form', () => {
        const simplifiedForm = simplifyForm(L525.forms[0]);
        should(simplifiedForm.representations.fr).equal('maisons');
        should(simplifiedForm.grammaticalFeatures[0]).equal('Q146786');
        should(simplifiedForm.claims).deepEqual({ P443: ['LL-Q150 (fra)-0x010C-maisons.wav'] });
    });
    it('should pass down options', () => {
        const simplifiedForm = simplifyForm(L525.forms[0], { keepIds: true });
        should(simplifiedForm.representations.fr).equal('maisons');
        should(simplifiedForm.grammaticalFeatures[0]).equal('Q146786');
        should(simplifiedForm.claims).deepEqual({
            P443: [
                {
                    id: 'L525-F1$079bdca7-5130-4f9f-bac9-e8d032c38263',
                    value: 'LL-Q150 (fra)-0x010C-maisons.wav',
                },
            ],
        });
    });
});
describe('simplify.forms', () => {
    it('should simplify forms', () => {
        const simplifiedForms = simplifyForms(L525.forms);
        should(simplifiedForms).be.an.Array();
        should(simplifiedForms).deepEqual(L525.forms.map(form => simplifyForm(form)));
    });
    it('should pass down options', () => {
        const simplifiedForms = simplifyForms(L525.forms, { keepIds: true });
        should(simplifiedForms).be.an.Array();
        // @ts-expect-error TODO: keepIds result in different output type
        should(simplifiedForms[0].claims.P443[0].id).equal('L525-F1$079bdca7-5130-4f9f-bac9-e8d032c38263');
    });
});
//# sourceMappingURL=simplify_forms.js.map