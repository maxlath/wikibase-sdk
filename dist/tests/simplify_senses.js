import should from 'should';
import { simplifySenses, simplifySense } from '../src/helpers/simplify_senses.js';
import { L525 } from './data/L525.js';
describe('simplify.sense', () => {
    it('should reject an object that isnt a sense', () => {
        // @ts-expect-error not a sense
        should(() => simplifySense({})).throw('invalid sense object');
    });
    it('should simplify a sense', () => {
        const simplifiedSense = simplifySense(L525.senses[0]);
        should(simplifiedSense.glosses.fr).equal("édifice destiné à l'habitation");
        should(simplifiedSense.claims).deepEqual({
            P5137: ['Q3947'],
            P5972: ['L41768-S2', 'L267790-S1', 'L220794-S1'],
        });
    });
    it('should pass down options', () => {
        const simplifiedSense = simplifySense(L525.senses[0], { keepIds: true });
        should(simplifiedSense.glosses.fr).equal("édifice destiné à l'habitation");
        should(simplifiedSense.claims).deepEqual({
            P5137: [
                {
                    value: 'Q3947',
                    id: 'L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48',
                },
            ],
            P5972: [
                {
                    value: 'L41768-S2',
                    id: 'L525-S1$7cc12e5f-4ab8-0143-d661-59e2cfff6a0a',
                },
                {
                    value: 'L267790-S1',
                    id: 'L525-S1$a419bf3c-45ea-6793-6223-8fc57a9b97a5',
                },
                {
                    value: 'L220794-S1',
                    id: 'L525-S1$03cb990a-46a4-8dfa-070a-17d5bd300cb3',
                },
            ],
        });
    });
});
describe('simplify.senses', () => {
    it('should simplify senses', () => {
        const simplifiedSenses = simplifySenses(L525.senses);
        should(simplifiedSenses).be.an.Array();
        should(simplifiedSenses).deepEqual(L525.senses.map(sense => simplifySense(sense)));
    });
    it('should pass down options', () => {
        const simplifiedSenses = simplifySenses(L525.senses, { keepIds: true });
        should(simplifiedSenses).be.an.Array();
        // @ts-expect-error keepIds results in different type
        should(simplifiedSenses[0].claims.P5137[0].id).equal('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48');
    });
});
//# sourceMappingURL=simplify_senses.js.map