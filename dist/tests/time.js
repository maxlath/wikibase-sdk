import should from 'should';
import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay, } from '../src/helpers/time.js';
import { Q970917 } from './data/Q970917.js';
import { assert } from './lib/utils.js';
describe('time helpers', () => {
    const ISOtime = '2014-05-14T00:00:00.000Z';
    const wdTime = '+2014-05-14T00:00:00Z';
    const epoch = 1400025600000;
    const ISOnegativeTime = '-000044-03-15T00:00:00.000Z';
    const negativeWdTime = '-0044-03-15T00:00:00Z';
    const negativeEpoch = -63549360000000;
    describe('wikibaseTimeToEpochTime', () => {
        it('env', () => {
            should(new Date(epoch).toISOString()).equal(ISOtime);
            should(new Date(negativeEpoch).toISOString()).equal(ISOnegativeTime);
        });
        it('should return a number (epoch time)', () => {
            should(wikibaseTimeToEpochTime(wdTime)).be.a.Number();
        });
        it('should return a number for negative time', () => {
            should(wikibaseTimeToEpochTime(negativeWdTime)).be.a.Number();
        });
        it('should return the right number', () => {
            should(wikibaseTimeToEpochTime(wdTime)).equal(epoch);
        });
        it('should return the right number for negative time too', () => {
            should(wikibaseTimeToEpochTime(negativeWdTime)).equal(negativeEpoch);
        });
        it('should accept a value object', () => {
            const expected = [
                -3160944000000,
                657417600000,
                631152000000,
            ];
            should(Q970917.claims.P569.length).equal(expected.length);
            Q970917.claims.P569.forEach((claim, i) => {
                assert(claim.mainsnak.datavalue.type === 'time');
                should(wikibaseTimeToEpochTime(claim.mainsnak.datavalue.value)).equal(expected[i]);
            });
        });
    });
    describe('wikibaseTimeToISOString', () => {
        it('should convert wikibase date to ISO date', () => {
            should(wikibaseTimeToISOString('+1885-05-22T00:00:00Z')).equal('1885-05-22T00:00:00.000Z');
            should(wikibaseTimeToISOString('+0180-03-17T00:00:00Z')).equal('0180-03-17T00:00:00.000Z');
            should(wikibaseTimeToISOString('-0398-00-00T00:00:00Z')).equal('-000398-01-01T00:00:00.000Z');
            should(wikibaseTimeToISOString('-34000-00-00T00:00:00Z')).equal('-034000-01-01T00:00:00.000Z');
            should(wikibaseTimeToISOString('+34000-00-00T00:00:00Z')).equal('+034000-01-01T00:00:00.000Z');
        });
        it('should return a valid time for possible invalid dates', () => {
            should(wikibaseTimeToISOString('+1953-00-00T00:00:00Z')).equal('1953-01-01T00:00:00.000Z');
            should(wikibaseTimeToISOString('+1953-11-00T00:00:00Z')).equal('1953-11-01T00:00:00.000Z');
        });
        it('should return a valid time even for possible invalid negative date', () => {
            should(wikibaseTimeToISOString('-1953-00-00T00:00:00Z')).equal('-001953-01-01T00:00:00.000Z');
            should(wikibaseTimeToISOString('-1953-11-00T00:00:00Z')).equal('-001953-11-01T00:00:00.000Z');
        });
        it('should return a valid time for dates far in the past', () => {
            should(wikibaseTimeToISOString('-13798000000-00-00T00:00:00Z')).equal('-13798000000-01-01T00:00:00Z');
            should(wikibaseTimeToISOString('-13798000000-02-00T00:00:00Z')).equal('-13798000000-02-01T00:00:00Z');
            should(wikibaseTimeToISOString('-13798000000-02-07T15:00:00Z')).equal('-13798000000-02-07T15:00:00Z');
        });
        it('should return a valid time for dates far in the future', () => {
            should(wikibaseTimeToISOString('+13798000000-00-00T00:00:00Z')).equal('+13798000000-01-01T00:00:00Z');
            should(wikibaseTimeToISOString('+13798000000-02-00T00:00:00Z')).equal('+13798000000-02-01T00:00:00Z');
            should(wikibaseTimeToISOString('+13798000000-02-07T15:00:00Z')).equal('+13798000000-02-07T15:00:00Z');
        });
        it('should accept a value object', () => {
            const expected = [
                '1869-11-01T00:00:00.000Z',
                '1990-11-01T00:00:00.000Z',
                '1990-01-01T00:00:00.000Z',
            ];
            should(Q970917.claims.P569.length).equal(expected.length);
            Q970917.claims.P569.forEach((claim, i) => {
                assert(claim.mainsnak.datavalue.type === 'time');
                should(wikibaseTimeToISOString(claim.mainsnak.datavalue.value)).equal(expected[i]);
            });
        });
    });
    describe('wikibaseTimeToSimpleDay', () => {
        it('should convert wikibase date with year precision to simple-day', () => {
            should(wikibaseTimeToSimpleDay('+1953-00-00T00:00:00Z')).equal('1953');
            should(wikibaseTimeToSimpleDay('-1953-00-00T00:00:00Z')).equal('-1953');
            should(wikibaseTimeToSimpleDay('+13-00-00T00:00:00Z')).equal('13');
            should(wikibaseTimeToSimpleDay('-13-00-00T00:00:00Z')).equal('-13');
            should(wikibaseTimeToSimpleDay('-0100-00-00T00:00:00Z')).equal('-100');
        });
        it('should convert wikibase date with month precision to simple-day', () => {
            should(wikibaseTimeToSimpleDay('+1953-01-00T00:00:00Z')).equal('1953-01');
            should(wikibaseTimeToSimpleDay('-1953-01-00T00:00:00Z')).equal('-1953-01');
            should(wikibaseTimeToSimpleDay('+13-01-00T00:00:00Z')).equal('13-01');
            should(wikibaseTimeToSimpleDay('-13-01-00T00:00:00Z')).equal('-13-01');
            should(wikibaseTimeToSimpleDay('-0044-03-00T00:00:00Z')).equal('-44-03');
        });
        it('should convert wikibase date with day precision or finer to simple-day', () => {
            should(wikibaseTimeToSimpleDay('+1953-01-01T00:00:00Z')).equal('1953-01-01');
            should(wikibaseTimeToSimpleDay('-1953-01-01T00:00:00Z')).equal('-1953-01-01');
            should(wikibaseTimeToSimpleDay('+1953-01-01T13:45:00Z')).equal('1953-01-01');
            should(wikibaseTimeToSimpleDay('-1953-01-01T13:45:00Z')).equal('-1953-01-01');
            should(wikibaseTimeToSimpleDay('-0044-03-01T00:00:00Z')).equal('-44-03-01');
        });
        it('should accept a value object', () => {
            assert(Q970917.claims.P569[0].mainsnak.datavalue.type === 'time');
            should(wikibaseTimeToSimpleDay(Q970917.claims.P569[0].mainsnak.datavalue.value)).equal('1869-11');
        });
    });
});
//# sourceMappingURL=time.js.map