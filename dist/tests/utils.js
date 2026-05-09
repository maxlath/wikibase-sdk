import should from 'should';
import { isPlainObject } from '../src/utils/utils.js';
describe('utils', () => {
    describe('isPlainObject', () => {
        it('should return true for plain objects', () => {
            should(isPlainObject({})).be.true();
            should(isPlainObject({ a: 1, b: 2 })).be.true();
        });
        it('should return false for arrays', () => {
            should(isPlainObject([])).be.false();
            should(isPlainObject([1, 2])).be.false();
        });
        it('should return false for strings', () => {
            should(isPlainObject('')).be.false();
            should(isPlainObject('hello')).be.false();
        });
        it('should return false for null', () => {
            should(isPlainObject(null)).be.false();
        });
        it('should return false for undefined', () => {
            should(isPlainObject(undefined)).be.false();
        });
    });
});
//# sourceMappingURL=utils.js.map