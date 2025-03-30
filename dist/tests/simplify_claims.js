// @ts-nocheck
import should from 'should';
import { simplifyClaim, simplifyPropertyClaims, simplifyClaims } from '../src/helpers/simplify_claims.js';
import { uniq } from '../src/utils/utils.js';
import { L525 } from './data/L525.js';
import { P3035 } from './data/P3035.js';
import { Q1 } from './data/Q1.js';
import { Q2112 } from './data/Q2112.js';
import { Q217447 } from './data/Q217447.js';
import { Q22002395 } from './data/Q22002395.js';
import { Q235557 } from './data/Q235557.js';
import { Q271094 } from './data/Q271094.js';
import { Q275937 } from './data/Q275937.js';
import { Q328212 } from './data/Q328212.js';
import { Q4115189 } from './data/Q4115189.js';
import { Q4132785 } from './data/Q4132785.js';
import { Q571 } from './data/Q571.js';
import { Q646148 } from './data/Q646148.js';
import { emptyValues } from './data/empty_values.js';
import { lexemeClaim } from './data/lexeme_claim.js';
import { oldClaimFormat } from './data/old_claim_format.js';
describe('simplifyClaims', () => {
    it('env', () => {
        should(Q571).be.an.Object();
        should(Q571.claims).be.ok();
        should(Q4132785).be.an.Object();
        should(Q4132785.claims.P577[0]).be.ok();
    });
    it('should return an object', () => {
        should(simplifyClaims(Q571.claims)).be.an.Object();
    });
    it('should not mutate the original object', () => {
        const simplified = simplifyClaims(Q571.claims);
        should(simplified).not.equal(Q571.claims);
        should(simplified.P487).not.equal(Q571.claims.P487);
    });
    it('should return an object of same length', () => {
        const originalLength = Object.keys(Q571.claims).length;
        const simplified = simplifyClaims(Q571.claims);
        const newLength = Object.keys(simplified).length;
        should(newLength).equal(originalLength);
    });
    it('should return an indexed collection of arrays', () => {
        const simplified = simplifyClaims(Q571.claims);
        for (const key in simplified) {
            should(simplified[key]).be.an.Array();
        }
    });
    it('should pass entity and property prefixes down', () => {
        const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd' });
        should(simplified.P190[0]).equal('wd:Q207614');
        const simplified2 = simplifyClaims(P3035.claims, { propertyPrefix: 'wdt' });
        should(simplified2['wdt:P1659'][0]).equal('P212');
    });
    it('should return prefixed properties if passed a property prefix', () => {
        const simplified = simplifyClaims(Q2112.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt' });
        should(simplified['wdt:P190']).be.an.Array();
        should(simplified['wdt:P190'][0]).equal('wd:Q207614');
        const simplified2 = simplifyClaims(P3035.claims, { propertyPrefix: 'wdt' });
        should(simplified2['wdt:P1659'][0]).equal('P212');
    });
    it('should return the correct value when called with keepQualifiers=true', () => {
        const simplified = simplifyClaims(Q571.claims);
        const simplifiedWithQualifiers = simplifyClaims(Q571.claims, { keepQualifiers: true });
        Object.keys(simplifiedWithQualifiers).forEach(property => {
            const propertyValues = simplifiedWithQualifiers[property];
            should(propertyValues).be.an.Array();
            propertyValues.forEach((valueObj, index) => {
                should(valueObj).be.an.Object();
                const value = simplified[property][index];
                should(valueObj.value).equal(value);
                should(valueObj.qualifiers).be.an.Object();
            });
        });
    });
    it('should include prefixes in qualifiers claims', () => {
        var _a, _b;
        const simplifiedWithQualifiers = simplifyClaims(Q646148.claims, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true });
        const simplifiedClaim = simplifiedWithQualifiers['wdt:P39'][1];
        should((_a = simplifiedClaim.qualifiers) === null || _a === void 0 ? void 0 : _a['wdt:P1365']).be.an.Array();
        should((_b = simplifiedClaim.qualifiers) === null || _b === void 0 ? void 0 : _b['wdt:P1365'][0]).equal('wd:Q312881');
    });
});
describe('simplifyPropertyClaims', () => {
    it('should return an arrays', () => {
        const simplified = simplifyPropertyClaims(Q571.claims.P487);
        should(simplified).be.an.Array();
    });
    it('should not mutate the original array', () => {
        const simplified = simplifyPropertyClaims(Q571.claims.P487);
        should(simplified).not.equal(Q571.claims.P487);
        should(simplified[0]).not.equal(Q571.claims.P487[0]);
    });
    it('should keep only non-null values', () => {
        const simplified = simplifyPropertyClaims(Q22002395.claims.P50);
        // Q22002395 P50 has 2 values with "snaktype": "somevalue"
        // that should be removed
        simplified.forEach(qid => should(qid).not.be.null());
    });
    it('should deduplicated values', () => {
        const { P50 } = Q22002395.claims;
        const claimsWithDuplicates = P50.concat(P50);
        const simplified = simplifyPropertyClaims(claimsWithDuplicates);
        should(uniq(simplified).length).equal(simplified.length);
    });
    it('should pass entity and property prefixes down', () => {
        const simplified = simplifyPropertyClaims(Q2112.claims.P190, { entityPrefix: 'wd' });
        should(simplified[0]).equal('wd:Q207614');
        const simplified2 = simplifyPropertyClaims(P3035.claims.P1659, { entityPrefix: 'a', propertyPrefix: 'b' });
        should(simplified2[0]).equal('a:P212');
    });
    it('should return the correct value when called with keepQualifiers=true', () => {
        const simplified = simplifyPropertyClaims(Q571.claims.P279);
        const simplifiedWithQualifiers = simplifyPropertyClaims(Q571.claims.P279, { keepQualifiers: true });
        should(simplifiedWithQualifiers).be.an.Array();
        simplifiedWithQualifiers.forEach((valueObj, index) => {
            should(valueObj).be.an.Object();
            const value = simplified[index];
            should(valueObj.value).equal(value);
            should(valueObj.qualifiers).be.an.Object();
        });
    });
    it('should include prefixes in qualifiers claims', () => {
        const simplifiedWithQualifiers = simplifyPropertyClaims(Q646148.claims.P39, { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true });
        const propertyQualifiers = simplifiedWithQualifiers[1].qualifiers['wdt:P1365'];
        should(propertyQualifiers).be.an.Array();
        should(propertyQualifiers[0]).equal('wd:Q312881');
    });
    it('construct entity ids for old dump format', () => {
        const simplified = simplifyPropertyClaims(oldClaimFormat);
        should(simplified.length).equal(2);
        should(simplified[0]).equal('Q123');
        should(simplified[1]).equal('P123');
    });
    it('should tolerate empty inputs', () => {
        // @ts-expect-error empty input is not typed
        const simplified = simplifyPropertyClaims();
        should(simplified).be.an.Array();
        should(simplified.length).equal(0);
        const simplified2 = simplifyPropertyClaims([]);
        should(simplified2).be.an.Array();
        should(simplified2.length).equal(0);
    });
    describe('ranks', () => {
        it('should return only truthy statements by default', () => {
            const simplified = simplifyPropertyClaims(Q4115189.claims.P135);
            should(simplified.length).equal(1);
            should(simplified).deepEqual(['Q2044250']);
        });
        it('should return non-truthy statements if requested', () => {
            const options = { keepNonTruthy: true };
            const simplified = simplifyPropertyClaims(Q4115189.claims.P135, options);
            should(simplified).deepEqual(['Q213454', 'Q2044250', 'Q5843']);
        });
        it('should return non-deprecated statements if requested', () => {
            const options = { keepNonDeprecated: true };
            const simplified = simplifyPropertyClaims(Q4115189.claims.P135, options);
            should(simplified.length).equal(2);
            should(simplified).deepEqual(['Q2044250', 'Q5843']);
        });
        it('should keep ranks', () => {
            should(simplifyPropertyClaims(Q4115189.claims.P135, { keepRanks: true })).deepEqual([
                { value: 'Q2044250', rank: 'preferred' },
            ]);
            should(simplifyPropertyClaims(Q4115189.claims.P135, { keepRanks: true, keepNonTruthy: true })).deepEqual([
                { value: 'Q213454', rank: 'deprecated' },
                { value: 'Q2044250', rank: 'preferred' },
                { value: 'Q5843', rank: 'normal' },
            ]);
        });
    });
    describe('empty values', () => {
        it('should not filter-out empty values if given a placeholder value', () => {
            should(simplifyPropertyClaims(emptyValues.claims.P3984).length).equal(1);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-' }).length).equal(2);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: null }).length).equal(2);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { somevalueValue: '?' }).length).equal(2);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { somevalueValue: null }).length).equal(2);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: null, somevalueValue: null }).length).equal(3);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-', somevalueValue: '?' }).length).equal(3);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { novalueValue: '-', somevalueValue: '?' })).deepEqual(['-', '?', 'bacasable']);
        });
        it('should keep snaktype if requested', () => {
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { keepSnaktypes: true })).deepEqual([
                { value: undefined, snaktype: 'novalue' },
                { value: undefined, snaktype: 'somevalue' },
                { value: 'bacasable', snaktype: 'value' },
            ]);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, {
                keepSnaktypes: true,
                novalueValue: '-',
                somevalueValue: '?',
            })).deepEqual([
                { value: '-', snaktype: 'novalue' },
                { value: '?', snaktype: 'somevalue' },
                { value: 'bacasable', snaktype: 'value' },
            ]);
        });
        it('should not filter-out empty values if requested as object values', () => {
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { keepQualifiers: true })).deepEqual([
                { value: undefined, qualifiers: {} },
                { value: undefined, qualifiers: {} },
                { value: 'bacasable', qualifiers: {} },
            ]);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { keepReferences: true })).deepEqual([
                { value: undefined, references: [] },
                { value: undefined, references: [] },
                { value: 'bacasable', references: [] },
            ]);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { keepIds: true })).deepEqual([
                { value: undefined, id: 'Q4115189$c973aadc-48d3-5ac2-45fc-9f34a51ebdf6' },
                { value: undefined, id: 'Q4115189$db1940f1-41bd-ad24-8fbc-20bc6465a35f' },
                { value: 'bacasable', id: 'Q4115189$5c85ec5e-48f5-716d-8944-c4364693e406' },
            ]);
            should(simplifyPropertyClaims(emptyValues.claims.P3984, { keepTypes: true })).deepEqual([
                { value: undefined, type: 'external-id' },
                { value: undefined, type: 'external-id' },
                { value: 'bacasable', type: 'external-id' },
            ]);
        });
    });
    it('should use the placeholder value for empty values in object values', () => {
        should(simplifyPropertyClaims(emptyValues.claims.P3984, {
            keepQualifiers: true,
            novalueValue: '-',
            somevalueValue: '?',
        })).deepEqual([
            { value: '-', qualifiers: {} },
            { value: '?', qualifiers: {} },
            { value: 'bacasable', qualifiers: {} },
        ]);
    });
});
describe('simplifyClaim', () => {
    describe('datatypes', () => {
        it('should return a url for datatype url', () => {
            const simplified = simplifyClaim(Q328212.claims.P856[0]);
            should(simplified).equal('https://veronicarothbooks.com/');
        });
        it('should return simplified globecoordinate as a latLng array', () => {
            const simplified = simplifyClaim(Q2112.claims.P625[0]);
            should(simplified).be.an.Array();
            should(simplified[0]).equal(52.016666666667);
            should(simplified[1]).equal(8.5333333333333);
        });
        it('should support geo-shape', () => {
            should(simplifyClaim(Q217447.claims.P3896[0])).equal('Data:Rky/1277 Verlan teollisuusympäristö.map');
        });
        it('should support tabular-data', () => {
            should(simplifyClaim(Q271094.claims.P4179[0])).equal('Data:Taipei Neihu District Population.tab');
        });
        it('should support lexemes', () => {
            should(simplifyClaim(lexemeClaim)).equal('L397');
        });
        it('should support musical-notation', () => {
            should(simplifyClaim(Q4115189.claims.P6604[0])).equal('\\relative { c d e f g e }');
        });
        it('should support wikibase-form', () => {
            should(simplifyClaim(Q275937.claims.P8017[0])).equal('L252247-F2');
        });
        it('should support wikibase-sense', () => {
            should(simplifyClaim(L525.senses[0].claims.P5972[0])).equal('L41768-S2');
        });
        it('should support entity-schema', () => {
            should(simplifyClaim(Q235557.claims.P12861[0])).equal('E79');
        });
    });
    describe('prefixes', () => {
        it('should return prefixed entity ids if passed an entity prefix', () => {
            const claim = Q2112.claims.P190[0];
            should(simplifyClaim(claim)).equal('Q207614');
            should(simplifyClaim(claim, { entityPrefix: 'wd' })).equal('wd:Q207614');
            should(simplifyClaim(claim, { entityPrefix: 'wd:' })).equal('wd::Q207614');
            should(simplifyClaim(claim, { entityPrefix: 'wdbla' })).equal('wdbla:Q207614');
        });
        it('should not apply property prefixes to property claim values', () => {
            const claim = P3035.claims.P1659[0];
            should(simplifyClaim(claim)).equal('P212');
            should(simplifyClaim(claim, { propertyPrefix: 'wdt' })).equal('P212');
            should(simplifyClaim(claim, { propertyPrefix: 'wdt:' })).equal('P212');
            should(simplifyClaim(claim, { propertyPrefix: 'wdtbla' })).equal('P212');
            should(simplifyClaim(claim, { entityPrefix: 'wd' })).equal('wd:P212');
            should(simplifyClaim(claim, { entityPrefix: 'wd:' })).equal('wd::P212');
            should(simplifyClaim(claim, { entityPrefix: 'wdbla' })).equal('wdbla:P212');
        });
    });
    describe('keepTypes', () => {
        it('should return the correct value when called with keepQualifiers=true', () => {
            const simplified = simplifyClaim(Q2112.claims.P190[0], { keepTypes: true });
            should(simplified).deepEqual({ value: 'Q207614', type: 'wikibase-item' });
        });
    });
    describe('qualifiers', () => {
        it('should return the correct value when called with keepQualifiers=true', () => {
            const simplified = simplifyClaim(Q571.claims.P279[0]);
            const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P279[0], { keepQualifiers: true });
            should(simplifiedWithQualifiers.value).equal(simplified);
            should(simplifiedWithQualifiers.qualifiers).be.an.Object();
        });
        it('should include qualifiers when called with keepQualifiers=true', () => {
            const simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true });
            const { P973, P813 } = simplifiedWithQualifiers.qualifiers;
            should(P973).be.an.Array();
            should(P973[0]).equal('http://mappings.dbpedia.org/index.php/OntologyClass:Book');
            should(P813).be.an.Array();
            should(P813[0]).equal('2015-06-11T00:00:00.000Z');
        });
        it('should include prefixes in qualifiers claims', () => {
            const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepQualifiers: true });
            const propertyQualifiers = simplifiedWithQualifiers.qualifiers['wdt:P1365'];
            should(propertyQualifiers).be.an.Array();
            should(propertyQualifiers[0]).equal('wd:Q312881');
        });
        it('should include types in qualifiers claims', () => {
            const simplifiedWithQualifiers = simplifyClaim(Q646148.claims.P39[1], { keepTypes: true, keepQualifiers: true });
            const { P1365 } = simplifiedWithQualifiers.qualifiers;
            should(P1365).be.an.Array();
            should(P1365[0]).deepEqual({ value: 'Q312881', type: 'wikibase-item' });
        });
        it('should respect timeConverter for qualifiers claims', () => {
            let simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'iso' });
            let P813 = simplifiedWithQualifiers.qualifiers.P813;
            should(P813).be.an.Array();
            should(P813[0]).equal('2015-06-11T00:00:00.000Z');
            simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'epoch' });
            P813 = simplifiedWithQualifiers.qualifiers.P813;
            should(P813).be.an.Array();
            should(P813[0]).equal(1433980800000);
            simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'simple-day' });
            P813 = simplifiedWithQualifiers.qualifiers.P813;
            should(P813).be.an.Array();
            should(P813[0]).equal('2015-06-11');
            simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: 'none' });
            P813 = simplifiedWithQualifiers.qualifiers.P813;
            should(P813).be.an.Array();
            should(P813[0]).equal('+2015-06-11T00:00:00Z');
            simplifiedWithQualifiers = simplifyClaim(Q571.claims.P1709[0], { keepQualifiers: true, timeConverter: v => `foo/${v.time}/${v.precision}/bar` });
            P813 = simplifiedWithQualifiers.qualifiers.P813;
            should(P813).be.an.Array();
            should(P813[0]).equal('foo/+2015-06-11T00:00:00Z/11/bar');
        });
    });
    describe('references', () => {
        it('should return the correct value when called with keepReferences=true', () => {
            const simplified = simplifyClaim(Q2112.claims.P214[0]);
            const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true });
            should(simplifiedWithReferences.value).equal(simplified);
            should(simplifiedWithReferences.references).be.an.Object();
        });
        it('should include references when called with keepReferences=true', () => {
            const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true });
            should(simplifiedWithReferences.references[0].P248).be.an.Array();
            should(simplifiedWithReferences.references[0].P248[0]).equal('Q54919');
            should(simplifiedWithReferences.references[0].P813).be.an.Array();
            should(simplifiedWithReferences.references[0].P813[0]).equal('2015-08-02T00:00:00.000Z');
        });
        it('should include prefixes in references claims', () => {
            const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { entityPrefix: 'wd', propertyPrefix: 'wdt', keepReferences: true });
            should(simplifiedWithReferences.references[0]['wdt:P248']).be.an.Array();
            should(simplifiedWithReferences.references[0]['wdt:P248'][0]).equal('wd:Q54919');
        });
    });
    describe('ids', () => {
        it('should return the correct value when called with keepIds=true', () => {
            const simplified = simplifyClaim(Q2112.claims.P214[0]);
            const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true });
            should(simplifiedWithIds.value).equal(simplified);
            should(simplifiedWithIds.id).be.a.String();
        });
        it('should include ids when called with keepReferences=true', () => {
            const simplifiedWithIds = simplifyClaim(Q2112.claims.P214[0], { keepIds: true });
            should(simplifiedWithIds.id).equal('Q2112$ECB9E5BB-B2E1-4E77-8CEE-4E9F4938EB86');
        });
    });
    describe('hashes', () => {
        it('should return the correct value when called with keepHashes=true', () => {
            const simplified = simplifyClaim(Q2112.claims.P214[0]);
            const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepQualifiers: true, keepHashes: true });
            should(simplifiedWithReferences.value).equal(simplified);
        });
        it('should include references hashes when called with keepHashes=true', () => {
            const simplifiedWithReferences = simplifyClaim(Q2112.claims.P214[0], { keepReferences: true, keepHashes: true });
            should(simplifiedWithReferences.references[0].snaks.P248).be.an.Array();
            should(simplifiedWithReferences.references[0].hash).equal('94cd09bdd3373d7b8eb4e3cc26e524afe7466ff7');
            should(simplifiedWithReferences.references[0].snaks.P248[0].value).equal('Q54919');
            should(simplifiedWithReferences.references[0].snaks.P248[0].hash).equal('6b7d4330c4aac4caec4ede9de0311ce273f88ecd');
            should(simplifiedWithReferences.references[0].snaks.P813).be.an.Array();
            should(simplifiedWithReferences.references[0].snaks.P813[0].value).equal('2015-08-02T00:00:00.000Z');
            should(simplifiedWithReferences.references[0].snaks.P813[0].hash).equal('bf4494cf3e2345d75aa355a5847a72d38ca6c55d');
        });
        it('should include qualifiers hashes when called with keepHashes=true', () => {
            const simplifiedWithQualifiers = simplifyPropertyClaims(Q2112.claims.P190, { keepQualifiers: true, keepHashes: true });
            should(simplifiedWithQualifiers[1].qualifiers.P580[0].value).equal('1953-01-01T00:00:00.000Z');
            should(simplifiedWithQualifiers[1].qualifiers.P580[0].hash).equal('a5e0dc0fab1c88e0702eab5557dfec4f8ab8a289');
        });
    });
    describe('rich values', () => {
        it('should keep monolingual rich values', () => {
            const simplified = simplifyClaim(Q328212.claims.P1477[0], { keepRichValues: true });
            should(simplified.text).equal('Veronica Roth');
            should(simplified.language).equal('en');
        });
        it('should keep quantity rich values', () => {
            const simplified = simplifyClaim(Q2112.claims.P2044[0], { keepRichValues: true });
            should(simplified.amount).equal(118);
            should(simplified.unit).equal('Q11573');
            should(simplified.upperBound).equal(119);
            should(simplified.lowerBound).equal(117);
        });
        it('should keep globecoordinate rich values', () => {
            should(simplifyClaim(Q2112.claims.P625[0], { keepRichValues: true })).deepEqual({
                latitude: 52.016666666667,
                longitude: 8.5333333333333,
                altitude: null,
                precision: 0.016666666666667,
                globe: 'http://www.wikidata.org/entity/Q2',
            });
        });
        it('should keep time rich values', () => {
            should(simplifyClaim(Q646148.claims.P569[0], { keepRichValues: true })).deepEqual({
                time: '1939-11-08T00:00:00.000Z',
                timezone: 0,
                before: 0,
                after: 0,
                precision: 11,
                calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
            });
        });
        it('should be compatible with other "keep" options', () => {
            const simplified = simplifyClaim(Q328212.claims.P1477[0], {
                keepRichValues: true,
                keepRanks: true,
            });
            should(simplified.value.text).equal('Veronica Roth');
            should(simplified.value.language).equal('en');
            should(simplified.rank).equal('normal');
        });
    });
    describe('time converter', () => {
        it('should use a custom time converter when one is set', () => {
            const claim = Q646148.claims.P569[0];
            const simplifyTimeClaim = (timeConverter) => simplifyClaim(claim, { timeConverter });
            should(simplifyTimeClaim(undefined)).equal('1939-11-08T00:00:00.000Z');
            should(simplifyTimeClaim('iso')).equal('1939-11-08T00:00:00.000Z');
            should(simplifyTimeClaim('epoch')).equal(-951436800000);
            should(simplifyTimeClaim('simple-day')).equal('1939-11-08');
            should(simplifyTimeClaim('none')).equal('+1939-11-08T00:00:00Z');
            const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`;
            should(simplifyTimeClaim(timeConverterFn)).equal('foo/+1939-11-08T00:00:00Z/11/bar');
        });
        it('should be able to parse long dates', () => {
            const claim = Q1.claims.P580[0];
            const simplifyTimeClaim = (timeConverter) => simplifyClaim(claim, { timeConverter });
            should(simplifyTimeClaim(undefined)).equal('-13798000000-01-01T00:00:00Z');
            should(simplifyTimeClaim('none')).equal('-13798000000-00-00T00:00:00Z');
            should(simplifyTimeClaim('iso')).equal('-13798000000-01-01T00:00:00Z');
            should(simplifyTimeClaim('simple-day')).equal('-13798000000');
            const timeConverterFn = ({ time, precision }) => `foo/${time}/${precision}/bar`;
            should(simplifyTimeClaim(timeConverterFn)).equal('foo/-13798000000-00-00T00:00:00Z/3/bar');
            // Can't be supported due to JS large numbers limitations;
            // 13798000000*365.25*24*60*60*1000 is too big
            // should(timeClaim('epoch')).equal('-13798000000-00-00T00:00:00Z')
        });
    });
    describe('minTimePrecision', () => {
        it('should drop date claims with precision below the one requested', () => {
            should(simplifyPropertyClaims(Q1.claims.P580, { minTimePrecision: 5 })).deepEqual([]);
            should(simplifyPropertyClaims(Q4132785.claims.P577, { minTimePrecision: 11 }).length).equal(1);
            should(simplifyPropertyClaims(Q4132785.claims.P577, { minTimePrecision: 12 })).deepEqual([]);
            should(simplifyPropertyClaims(Q4132785.claims.P577, { minTimePrecision: 12 })).deepEqual([]);
        });
        it('should drop date qualifiers with precision below the one requested', () => {
            const claim = Q571.claims.P6404[0];
            should(simplifyClaim(claim, { minTimePrecision: 9, keepQualifiers: true }).qualifiers.P577.length).equal(1);
            should(simplifyClaim(claim, { minTimePrecision: 10, keepQualifiers: true }).qualifiers.P577).deepEqual([]);
        });
        it('should drop date qualifiers with precision below the one requested', () => {
            const claim = Q571.claims.P6404[0];
            should(simplifyClaim(claim, { minTimePrecision: 9, keepQualifiers: true }).qualifiers.P577.length).equal(1);
            should(simplifyClaim(claim, { minTimePrecision: 10, keepQualifiers: true }).qualifiers.P577).deepEqual([]);
        });
    });
    describe('empty values', () => {
        it('should return the desired novalueValue', () => {
            const noValueClaim = emptyValues.claims.P3984[0];
            should(simplifyClaim(noValueClaim)).not.be.ok();
            should(simplifyClaim(noValueClaim, { novalueValue: '-' })).equal('-');
            should(simplifyClaim(noValueClaim, { novalueValue: '' })).equal('');
        });
        it('should return the desired somevalueValue', () => {
            const someValueClaim = emptyValues.claims.P3984[1];
            should(simplifyClaim(someValueClaim)).not.be.ok();
            should(simplifyClaim(someValueClaim, { somevalueValue: '?' })).equal('?');
            should(simplifyClaim(someValueClaim, { somevalueValue: '' })).equal('');
        });
        it('should accept null as a possible value', () => {
            const noValueClaim = emptyValues.claims.P3984[0];
            should(simplifyClaim(noValueClaim, { novalueValue: null }) === null).be.true();
        });
        it('should return rich values for null values if requested', () => {
            should(simplifyClaim(emptyValues.claims.P3984[0], { keepQualifiers: true })).have.property('qualifiers');
            should(simplifyClaim(emptyValues.claims.P3984[0], { keepReferences: true })).have.property('references');
            should(simplifyClaim(emptyValues.claims.P3984[0], { keepIds: true })).have.property('id');
            should(simplifyClaim(emptyValues.claims.P3984[0], { keepTypes: true })).have.property('type');
        });
    });
    describe('keep all', () => {
        it('should activate all keep options', () => {
            const simplifiedP214 = simplifyClaim(Q2112.claims.P214[0], { keepAll: true });
            const simplifiedP625 = simplifyClaim(Q2112.claims.P625[0], { keepAll: true });
            should(simplifiedP214.value).be.a.String();
            should(simplifiedP214.id).be.a.String();
            should(simplifiedP214.type).be.a.String();
            should(simplifiedP214.rank).be.a.String();
            should(simplifiedP214.snaktype).be.a.String();
            should(simplifiedP214.qualifiers).be.an.Object();
            should(simplifiedP214.references).be.an.Array();
            should(simplifiedP214.references[0].snaks.P813[0].value).deepEqual({
                time: '2015-08-02T00:00:00.000Z',
                timezone: 0,
                before: 0,
                after: 0,
                precision: 11,
                calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
            });
            should(simplifiedP214.references[0].hash).be.a.String();
            should(simplifiedP625.value).deepEqual({
                latitude: 52.016666666667,
                longitude: 8.5333333333333,
                altitude: null,
                precision: 0.016666666666667,
                globe: 'http://www.wikidata.org/entity/Q2',
            });
        });
        it('should be overriden by other flags', () => {
            const simplified = simplifyClaim(Q2112.claims.P214[0], { keepAll: true, keepTypes: false });
            should(simplified.value).be.a.String();
            should(simplified.id).be.a.String();
            should(simplified.type).not.be.ok();
            should(simplified.rank).be.a.String();
            should(simplified.snaktype).be.a.String();
            should(simplified.qualifiers).be.an.Object();
            should(simplified.references).be.an.Array();
            should(simplified.references[0]).be.an.Object();
            should(simplified.references[0].hash).be.a.String();
        });
    });
    describe('lexemes', () => {
        it('should parse lexem claims', () => {
            should(simplifyClaims(L525.claims)).deepEqual({
                P5185: ['Q1775415'],
                P10338: ['maison'],
                P7724: ['maison'],
                P5191: ['L278335'],
                P7722: ['maison'],
                P11118: ['48725#48638'],
                P11178: ['maison'],
            });
        });
    });
});
//# sourceMappingURL=simplify_claims.js.map