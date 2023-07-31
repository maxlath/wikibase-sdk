import should from 'should';
import { simplifyReferences } from '../src/helpers/simplify_claims.js';
import { readJsonFile } from './lib/utils.js';
const Q217447 = readJsonFile('./tests/data/Q217447.json');
describe('simplifyReferences', () => {
    it('should simplify references', () => {
        should(simplifyReferences(Q217447.claims.P131[0].references)).deepEqual([{ P248: ['Q3485482'] }]);
    });
});
//# sourceMappingURL=simplify_references.js.map