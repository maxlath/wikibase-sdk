import should from 'should';
import { getEntityIdFromGuid, getImageUrl, getNumericId, isEntityId, isEntityPageTitle, isEntitySchemaId, isFormId, isGuid, isHash, isItemId, isLexemeId, isMediaInfoId, isNumericId, isPropertyClaimsId, isPropertyId, isSenseId, } from '../src/helpers/helpers.js';
describe('helpers', () => {
    describe('isEntityId', () => {
        it('should accept all supported entity types ids', () => {
            should(isEntityId('Q571')).be.true();
            should(isEntityId('P31')).be.true();
            should(isEntityId('L525')).be.true();
            should(isEntityId('L525-F1')).be.true();
            should(isEntityId('L525-S1')).be.true();
            should(isEntityId('L525-Z1')).be.false();
            should(isEntityId('M42')).be.true();
            should(isEntityId('31')).be.false();
            // @ts-expect-error non string input
            should(isEntityId(31)).be.false();
            should(isEntityId('Z31')).be.false();
            should(isEntityId('q31')).be.false();
            should(isEntityId('p31')).be.false();
        });
    });
    describe('isItemId', () => {
        it('should accept item ids', () => {
            should(isItemId('Q571')).be.true();
            should(isItemId('P31')).be.false();
            should(isItemId('31')).be.false();
            // @ts-expect-error non string input
            should(isItemId(31)).be.false();
            should(isItemId('Z31')).be.false();
            should(isItemId('q31')).be.false();
            should(isItemId('p31')).be.false();
        });
    });
    describe('isPropertyId', () => {
        it('should accept property ids', () => {
            should(isPropertyId('P31')).be.true();
            should(isPropertyId('Q571')).be.false();
            should(isPropertyId('31')).be.false();
            // @ts-expect-error non string input
            should(isPropertyId(31)).be.false();
            should(isPropertyId('Z31')).be.false();
            should(isPropertyId('q31')).be.false();
            should(isPropertyId('p31')).be.false();
        });
    });
    describe('isLexemeId', () => {
        it('should accept lexeme ids', () => {
            should(isLexemeId('L525')).be.true();
            should(isLexemeId('P31')).be.false();
            should(isLexemeId('Q571')).be.false();
            should(isLexemeId('31')).be.false();
            // @ts-expect-error non string input
            should(isLexemeId(31)).be.false();
            should(isLexemeId('Z31')).be.false();
            should(isLexemeId('q31')).be.false();
            should(isLexemeId('p31')).be.false();
        });
    });
    describe('isFormId', () => {
        it('should accept form ids', () => {
            should(isFormId('L525-F1')).be.true();
            should(isFormId('L525')).be.false();
            should(isFormId('L525F1')).be.false();
            should(isFormId('L525-S1')).be.false();
        });
    });
    describe('isSenseId', () => {
        it('should accept sense ids', () => {
            should(isSenseId('L525-S1')).be.true();
            should(isSenseId('L525')).be.false();
            should(isSenseId('L525S1')).be.false();
            should(isSenseId('L525-F1')).be.false();
        });
    });
    describe('isMediaInfoId', () => {
        it('should accept media info ids', () => {
            should(isMediaInfoId('M42')).be.true();
            should(isMediaInfoId('Q42')).be.false();
            should(isMediaInfoId('42')).be.false();
        });
    });
    describe('isGuid', () => {
        it('should accept guids for all supported entities types', () => {
            should(isGuid('q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C')).be.true();
            should(isGuid('Q520$91F0CCEA-19E4-4CEB-97D9-74B014C14686')).be.true();
            should(isGuid('q520$7f95c04f-4cb6-b018-80eb-fefe0e0bf377')).be.true();
            should(isGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec6')).be.true();
            should(isGuid('L525$faeae005-4b75-1319-5516-e08a8bdd0e9c')).be.true();
            should(isGuid('L525-F2$52c9b382-02f5-4413-9923-26ade74f5a0d')).be.true();
            should(isGuid('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48')).be.true();
            should(isGuid('P6216$a7fd6230-496e-6b47-ca4a-dcec5dbd7f95')).be.true();
            should(isGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec')).be.false();
            should(isGuid('Q520')).be.false();
        });
    });
    describe('isHash', () => {
        it('should accept hash', () => {
            should(isHash('14ddd544b82e2f811669d2bb4c939c4997536ce3')).be.true();
            should(isHash('14ddd544b82e2f811669d2bb4c939c4997536ce')).be.false();
            should(isHash('14ddd544b82e2f811669d2bb4c939c4997536ceaf')).be.false();
            should(isHash('14ddd544b82e2f811669d2bb4c939c4997536ceg')).be.false();
        });
    });
    describe('isPropertyClaimsId', () => {
        it('should accept property claims ids', () => {
            should(isPropertyClaimsId('Q1#P1')).be.true();
            should(isPropertyClaimsId('P12#P12')).be.true();
            should(isPropertyClaimsId('L123#P123')).be.true();
            should(isPropertyClaimsId('Q1~P1')).be.false();
            should(isPropertyClaimsId('Q1~Q1')).be.false();
        });
    });
    describe('isEntitySchemaId', () => {
        it('should accept entity schema ids', () => {
            should(isEntitySchemaId('E123')).be.true();
            should(isEntitySchemaId('Q123')).be.false();
        });
    });
    describe('isEntityPageTitle', () => {
        it('should accept correct titles', () => {
            should(isEntityPageTitle('Item:Q42')).be.true();
            should(isEntityPageTitle('Lexeme:L42')).be.true();
            should(isEntityPageTitle('Property:P42')).be.true();
            should(isEntityPageTitle('Q42')).be.true();
            should(isEntityPageTitle('Item:L42')).be.false();
            should(isEntityPageTitle('Lexeme:P42')).be.false();
            should(isEntityPageTitle('Property:Q42')).be.false();
            should(isEntityPageTitle('P42')).be.false();
        });
    });
    describe('isNumericId', () => {
        it('should accept numeric ids', () => {
            should(isNumericId('1')).be.true();
            should(isNumericId('Q1')).be.false();
        });
    });
    describe('getNumericId', () => {
        it('should get a numeric id from an entity id', () => {
            should(getNumericId('Q1')).equal('1');
            should(getNumericId('P1')).equal('1');
            should(getNumericId('L1')).equal('1');
            should(getNumericId('M1')).equal('1');
            should(() => getNumericId('L1-F1')).throw();
            should(() => getNumericId('L1-S1')).throw();
        });
    });
    describe('getImageUrl', () => {
        it('should build a commons FilePath Url', () => {
            should(getImageUrl('Peredot.jpg')).equal('https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg');
            should(getImageUrl('Peredot.jpg', 250)).equal('https://commons.wikimedia.org/wiki/Special:FilePath/Peredot.jpg?width=250');
        });
    });
    describe('getEntityIdFromGuid', () => {
        it('should support all kinds of guids', () => {
            should(getEntityIdFromGuid('q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C')).equal('Q520');
            should(getEntityIdFromGuid('Q520$91F0CCEA-19E4-4CEB-97D9-74B014C14686')).equal('Q520');
            should(getEntityIdFromGuid('q520$7f95c04f-4cb6-b018-80eb-fefe0e0bf377')).equal('Q520');
            should(getEntityIdFromGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec6')).equal('Q520');
            should(getEntityIdFromGuid('L525$faeae005-4b75-1319-5516-e08a8bdd0e9c')).equal('L525');
            should(getEntityIdFromGuid('L525-F2$52c9b382-02f5-4413-9923-26ade74f5a0d')).equal('L525-F2');
            should(getEntityIdFromGuid('L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48')).equal('L525-S1');
            should(getEntityIdFromGuid('P6216$a7fd6230-496e-6b47-ca4a-dcec5dbd7f95')).equal('P6216');
            should(getEntityIdFromGuid('Q520$4a0b85a0-4a47-3254-0379-52680370fec')).equal('Q520');
        });
        it('should support hyphenated versions', () => {
            should(getEntityIdFromGuid('q520-BCA8D9DE-B467-473B-943C-6FD0C5B3D02C')).equal('Q520');
            should(getEntityIdFromGuid('Q520-91F0CCEA-19E4-4CEB-97D9-74B014C14686')).equal('Q520');
            should(getEntityIdFromGuid('q520-7f95c04f-4cb6-b018-80eb-fefe0e0bf377')).equal('Q520');
            should(getEntityIdFromGuid('Q520-4a0b85a0-4a47-3254-0379-52680370fec6')).equal('Q520');
            should(getEntityIdFromGuid('L525-faeae005-4b75-1319-5516-e08a8bdd0e9c')).equal('L525');
            should(getEntityIdFromGuid('L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d')).equal('L525-F2');
            should(getEntityIdFromGuid('L525-S1-66D20252-8CEC-4DB1-8B00-D713CFF42E48')).equal('L525-S1');
            should(getEntityIdFromGuid('P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95')).equal('P6216');
            should(getEntityIdFromGuid('Q520-4a0b85a0-4a47-3254-0379-52680370fec')).equal('Q520');
        });
    });
});
//# sourceMappingURL=helpers.js.map