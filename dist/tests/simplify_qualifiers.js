import should from 'should';
import { simplifyQualifier, simplifyPropertyQualifiers, simplifyQualifiers } from '../src/helpers/simplify_claims.js';
import { Q19180293 } from './data/Q19180293.js';
import { Q2112 } from './data/Q2112.js';
import { Q571 } from './data/Q571.js';
describe('simplifyQualifier', () => {
    it('should simplify a qualifier', () => {
        const qualifier = Q2112.claims.P190[1].qualifiers.P580[0];
        const simplified = simplifyQualifier(qualifier);
        should(simplified).equal('1953-01-01T00:00:00.000Z');
    });
    describe('empty values', () => {
        it('should return the desired novalueValue', () => {
            const noValueQualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0];
            should(simplifyQualifier(noValueQualifier)).not.be.ok();
            should(simplifyQualifier(noValueQualifier, { novalueValue: '-' })).equal('-');
            should(simplifyQualifier(noValueQualifier, { novalueValue: '' })).equal('');
        });
        it('should return the desired somevalueValue', () => {
            const someValueQualifier = Q19180293.claims.P1433[0].qualifiers.P156[0];
            should(simplifyQualifier(someValueQualifier)).not.be.ok();
            should(simplifyQualifier(someValueQualifier, { somevalueValue: '?' })).equal('?');
            should(simplifyQualifier(someValueQualifier, { somevalueValue: '' })).equal('');
        });
        it('should accept null as a possible value', () => {
            const noValueQualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0];
            should(simplifyQualifier(noValueQualifier, { novalueValue: null }) === null).be.true();
        });
    });
    describe('time', () => {
        it('should respect timeConverter for qualifiers claims', () => {
            const qualifier = Q571.claims.P1709[0].qualifiers.P813[0];
            const timeClaim = timeConverter => simplifyQualifier(qualifier, { timeConverter });
            should(timeClaim('iso')).equal('2015-06-11T00:00:00.000Z');
            should(timeClaim('epoch')).equal(1433980800000);
            should(timeClaim('simple-day')).equal('2015-06-11');
            should(timeClaim('none')).equal('+2015-06-11T00:00:00Z');
            const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`;
            should(timeClaim(timeConverterFn)).equal('foo/+2015-06-11T00:00:00Z/11/bar');
        });
    });
});
describe('simplifyPropertyQualifiers', () => {
    it('should simplify propertyQualifiers', () => {
        const propertyQualifiers = Q2112.claims.P190[1].qualifiers.P580;
        const simplified = simplifyPropertyQualifiers(propertyQualifiers);
        should(simplified).deepEqual(['1953-01-01T00:00:00.000Z']);
    });
    describe('empty values', () => {
        it('should return the desired novalueValue', () => {
            const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P1100;
            should(simplifyPropertyQualifiers(propQualifiers, { novalueValue: '-' })).deepEqual(['-']);
            should(simplifyPropertyQualifiers(propQualifiers, { novalueValue: '' })).deepEqual(['']);
        });
        it('should return the desired somevalueValue', () => {
            const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P156;
            should(simplifyPropertyQualifiers(propQualifiers, { somevalueValue: '?' })).deepEqual(['?']);
            should(simplifyPropertyQualifiers(propQualifiers, { somevalueValue: '' })).deepEqual(['']);
        });
        it('should accept null as a possible value', () => {
            const propQualifiers = Q19180293.claims.P1433[0].qualifiers.P1100;
            should(simplifyPropertyQualifiers(propQualifiers, { novalueValue: null })).deepEqual([null]);
        });
    });
});
describe('simplifyQualifiers', () => {
    it('should simplify qualifiers', () => {
        const qualifiers = Q2112.claims.P190[1].qualifiers;
        const simplified = simplifyQualifiers(qualifiers);
        should(simplified.P580).deepEqual(['1953-01-01T00:00:00.000Z']);
    });
    describe('empty values', () => {
        it('should return the desired novalueValue', () => {
            const qualifiers = Q19180293.claims.P1433[0].qualifiers;
            should(simplifyQualifiers(qualifiers, { novalueValue: '-' }).P1100).deepEqual(['-']);
            should(simplifyQualifiers(qualifiers, { novalueValue: '' }).P1100).deepEqual(['']);
        });
        it('should return the desired somevalueValue', () => {
            const qualifiers = Q19180293.claims.P1433[0].qualifiers;
            should(simplifyQualifiers(qualifiers, { somevalueValue: '?' }).P156).deepEqual(['?']);
            should(simplifyQualifiers(qualifiers, { somevalueValue: '' }).P156).deepEqual(['']);
        });
        it('should accept null as a possible value', () => {
            const qualifiers = Q19180293.claims.P1433[0].qualifiers;
            should(simplifyQualifiers(qualifiers, { novalueValue: null }).P1100).deepEqual([null]);
        });
        it('should keep snaktype if requested', () => {
            const qualifier = Q19180293.claims.P1433[0].qualifiers.P1100[0];
            should(simplifyQualifier(qualifier, { keepSnaktypes: true })).deepEqual({ value: undefined, snaktype: 'novalue' });
        });
    });
});
//# sourceMappingURL=simplify_qualifiers.js.map