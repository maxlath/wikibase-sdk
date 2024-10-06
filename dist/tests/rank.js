import { cloneDeep } from 'lodash-es';
import should from 'should';
import { truthyClaims, truthyPropertyClaims } from '../src/helpers/rank.js';
import { Q4115189 } from './data/Q4115189.js';
import { assert } from './lib/utils.js';
describe('truthyClaims', () => {
    it('should filter-out non-truthy claims', () => {
        const Q4115189Claims = cloneDeep(Q4115189.claims);
        should(Q4115189Claims.P135.length).equal(3);
        const truthyOnly = truthyClaims(Q4115189Claims);
        should(truthyOnly.P135.length).equal(1);
        assert(truthyOnly.P135[0].mainsnak.datavalue.type === 'wikibase-entityid');
        should(truthyOnly.P135[0].mainsnak.datavalue.value.id).equal('Q2044250');
    });
});
describe('truthyPropertyClaims', () => {
    it('should filter-out non-truthy property claims', () => {
        const Q4115189Claims = cloneDeep(Q4115189.claims);
        should(Q4115189Claims.P135.length).equal(3);
        const truthyOnly = truthyPropertyClaims(Q4115189Claims.P135);
        should(truthyOnly.length).equal(1);
        assert(truthyOnly[0].mainsnak.datavalue.type === 'wikibase-entityid');
        should(truthyOnly[0].mainsnak.datavalue.value.id).equal('Q2044250');
    });
});
//# sourceMappingURL=rank.js.map