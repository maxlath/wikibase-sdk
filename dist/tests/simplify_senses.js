// @ts-nocheck
import should from 'should';
import { simplifySenses, simplifySense } from '../src/helpers/simplify_senses.js';
import { readJsonFile } from './lib/utils.js';
const L525 = readJsonFile('./tests/data/L525.json');
describe('simplify.sense', () => {
    it('should reject an object that isnt a sense', () => {
        should(() => simplifySense({})).throw('invalid sense object');
    });
    it('should simplify a sense', () => {
        const simplifiedSense = simplifySense(L525.senses[0]);
        should(simplifiedSense.glosses.fr).equal("édifice destiné à l'habitation");
        should(simplifiedSense.claims).deepEqual({ P5137: ['Q3947'] });
    });
    it('should pass down options', () => {
        const simplifiedSense = simplifySense(L525.senses[0], { keepIds: true });
        should(simplifiedSense.glosses.fr).equal("édifice destiné à l'habitation");
        should(simplifiedSense.claims).deepEqual({
            P5137: [
                {
                    id: 'L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48',
                    value: 'Q3947',
                },
            ],
        });
    });
});
describe('simplify.senses', () => {
    it('should simplify senses', () => {
        const simplifiedSenses = simplifySenses(L525.senses);
        should(simplifiedSenses).be.an.Array();
        should(simplifiedSenses).deepEqual(L525.senses.map(simplifySense));
    });
    it('should pass down options', () => {
        const simplifiedSenses = simplifySenses(L525.senses, { keepIds: true });
        should(simplifiedSenses).be.an.Array();
        should(simplifiedSenses[0].claims.P5137[0].id).equal('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48');
    });
});
//# sourceMappingURL=simplify_senses.js.map