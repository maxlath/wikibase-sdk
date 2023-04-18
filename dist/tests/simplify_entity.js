// @ts-nocheck
import { cloneDeep, pick } from 'lodash-es';
import should from 'should';
import { simplifyEntity, simplifyEntities } from '../src/helpers/simplify_entity.js';
import { readJsonFile } from './lib/utils.js';
const L525 = readJsonFile('./tests/data/L525.json');
const P8098 = readJsonFile('./tests/data/P8098.json');
const Q571 = readJsonFile('./tests/data/Q571.json');
describe('simplify.entity', () => {
    it('should be a function', () => {
        should(simplifyEntity).be.a.Function();
    });
    it('should support items', () => {
        const Q571Clone = cloneDeep(Q571);
        const simplifiedEntity = simplifyEntity(Q571Clone);
        if (simplifiedEntity.type !== 'item')
            throw new TypeError();
        should(simplifiedEntity.type).equal('item');
        should(simplifiedEntity.labels.fr).equal('livre');
        should(simplifiedEntity.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntity.aliases.pl).be.an.Array();
        should(simplifiedEntity.aliases.pl[0]).equal('Tom');
        should(simplifiedEntity.claims.P279).be.an.Array();
        should(simplifiedEntity.claims.P279[0]).equal('Q2342494');
        should(simplifiedEntity.sitelinks.afwiki).equal('Boek');
    });
    it('should support properties', () => {
        const P8098Clone = cloneDeep(P8098);
        const simplifiedEntity = simplifyEntity(P8098Clone);
        if (simplifiedEntity.type !== 'property')
            throw new TypeError();
        should(simplifiedEntity.type).equal('property');
        should(simplifiedEntity.datatype).equal('external-id');
        should(simplifiedEntity.labels.fr).equal('identifiant Biographical Dictionary of Architects in Canada');
        should(simplifiedEntity.descriptions.fr).equal("identifiant d'un architecte dans le Biographical Dictionary of Architects in Canada");
        should(simplifiedEntity.aliases.fr).be.an.Array();
        should(simplifiedEntity.aliases.fr[0]).equal('identifiant BDAC');
        should(simplifiedEntity.claims).be.an.Object();
        should(simplifiedEntity.claims.P1630).be.an.Array();
        should(simplifiedEntity.claims.P1630[0]).equal('http://dictionaryofarchitectsincanada.org/node/$1');
    });
    it('should support lexemes', () => {
        const L525Clone = cloneDeep(L525);
        const simplifiedEntity = simplifyEntity(L525Clone);
        if (simplifiedEntity.type !== 'lexeme')
            throw new TypeError();
        should(simplifiedEntity.type).equal('lexeme');
        should(simplifiedEntity.lemmas).be.an.Object();
        should(simplifiedEntity.lemmas.fr).equal('maison');
        should(simplifiedEntity.lexicalCategory).equal('Q1084');
        should(simplifiedEntity.language).equal('Q150');
        should(simplifiedEntity.claims).be.an.Object();
        should(simplifiedEntity.claims.P5185[0]).equal('Q1775415');
        should(simplifiedEntity.forms).be.an.Object();
        should(simplifiedEntity.forms[0].claims.P443[0]).equal('LL-Q150 (fra)-0x010C-maisons.wav');
        should(simplifiedEntity.senses).be.an.Object();
        should(simplifiedEntity.senses[0].glosses.fr).equal("édifice destiné à l'habitation");
        should(simplifiedEntity.senses[0].claims.P5137[0]).equal('Q3947');
    });
    it('should pass options down to subfunctions', () => {
        const Q571Clone = cloneDeep(Q571);
        const simplifiedEntity = simplifyEntity(Q571Clone, { keepQualifiers: true, keepIds: true, addUrl: true });
        should(simplifiedEntity.labels.fr).equal('livre');
        should(simplifiedEntity.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntity.aliases.pl).be.an.Array();
        should(simplifiedEntity.aliases.pl[0]).equal('Tom');
        should(simplifiedEntity.claims.P279).be.an.Array();
        should(simplifiedEntity.claims.P279[0]).be.an.Object();
        should(simplifiedEntity.claims.P279[0].value).equal('Q2342494');
        should(simplifiedEntity.sitelinks.afwiki).be.an.Object();
        should(simplifiedEntity.sitelinks.afwiki.title).equal('Boek');
        should(simplifiedEntity.sitelinks.afwiki.url).equal('https://af.wikipedia.org/wiki/Boek');
    });
    it('should accept partial entities', () => {
        const Q571Clone = cloneDeep(Q571);
        const emptyEntity = simplifyEntity({});
        should(Object.keys(emptyEntity).length).equal(3);
        const partialEntity = simplifyEntity(pick(Q571Clone, 'id', 'type', 'labels'));
        should(Object.keys(partialEntity).length).equal(4);
        should(partialEntity.labels).be.an.Object();
        should(partialEntity.labels.fr).equal('livre');
    });
});
describe('simplify.entities', () => {
    it('should accept enities objects', () => {
        const Q571Clone = cloneDeep(Q571);
        const entities = { Q571: Q571Clone };
        const simplifiedEntities = simplifyEntities(entities);
        should(simplifiedEntities.Q571.labels.fr).equal('livre');
        should(simplifiedEntities.Q571.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntities.Q571.aliases.pl).be.an.Array();
        should(simplifiedEntities.Q571.aliases.pl[0]).equal('Tom');
        should(simplifiedEntities.Q571.claims.P279).be.an.Array();
        should(simplifiedEntities.Q571.claims.P279[0]).equal('Q2342494');
        should(simplifiedEntities.Q571.sitelinks.afwiki).equal('Boek');
    });
});
//# sourceMappingURL=simplify_entity.js.map