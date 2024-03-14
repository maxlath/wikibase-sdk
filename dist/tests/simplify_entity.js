import { cloneDeep, pick } from 'lodash-es';
import should from 'should';
import { simplifyEntity, simplifyEntities } from '../src/helpers/simplify_entity.js';
import { L525 } from './data/L525.js';
import { P8098 } from './data/P8098.js';
import { Q571 } from './data/Q571.js';
import { assert } from './lib/utils.js';
describe('simplify.entity', () => {
    it('should be a function', () => {
        should(simplifyEntity).be.a.Function();
    });
    it('should support items', () => {
        const Q571Clone = cloneDeep(Q571);
        const simplifiedEntity = simplifyEntity(Q571Clone);
        assert(simplifiedEntity.type === 'item');
        should(simplifiedEntity.labels.fr).equal('livre');
        should(simplifiedEntity.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntity.aliases.pl).be.an.Array();
        should(simplifiedEntity.aliases.pl[0]).equal('księga');
        should(simplifiedEntity.claims.P279).be.an.Array();
        should(simplifiedEntity.claims.P279[0]).equal('Q340169');
        should(simplifiedEntity.sitelinks.afwiki).equal('Boek');
    });
    it('should support properties', () => {
        const P8098Clone = cloneDeep(P8098);
        const simplifiedEntity = simplifyEntity(P8098Clone);
        assert(simplifiedEntity.type === 'property');
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
        assert(simplifiedEntity.type === 'lexeme');
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
        assert(simplifiedEntity.type === 'item');
        should(simplifiedEntity.labels.fr).equal('livre');
        should(simplifiedEntity.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntity.aliases.pl).be.an.Array();
        should(simplifiedEntity.aliases.pl[0]).equal('księga');
        should(simplifiedEntity.claims.P279).be.an.Array();
        should(simplifiedEntity.claims.P279[0]).be.an.Object();
        // @ts-expect-error TODO: options result in different output type
        should(simplifiedEntity.claims.P279[0].value).equal('Q340169');
        should(simplifiedEntity.sitelinks.afwiki).be.an.Object();
        // @ts-expect-error TODO: options result in different output type
        should(simplifiedEntity.sitelinks.afwiki.title).equal('Boek');
        // @ts-expect-error TODO: options result in different output type
        should(simplifiedEntity.sitelinks.afwiki.url).equal('https://af.wikipedia.org/wiki/Boek');
    });
    it('should accept empty entity', () => {
        // @ts-expect-error very partial entity
        const emptyEntity = simplifyEntity({ type: 'item' });
        should(Object.keys(emptyEntity).length).equal(3);
    });
    it('should accept partial entity', () => {
        const Q571Clone = cloneDeep(Q571);
        const partialEntity = simplifyEntity(pick(Q571Clone, 'id', 'type', 'labels'));
        should(Object.keys(partialEntity).length).equal(4);
        assert(partialEntity.type === 'item');
        should(partialEntity.labels).be.an.Object();
        should(partialEntity.labels.fr).equal('livre');
    });
});
describe('simplify.entities', () => {
    it('should accept enities objects', () => {
        const Q571Clone = cloneDeep(Q571);
        const entities = { Q571: Q571Clone };
        const simplifiedEntities = simplifyEntities(entities);
        assert(simplifiedEntities.Q571.type === 'item');
        should(simplifiedEntities.Q571.labels.fr).equal('livre');
        should(simplifiedEntities.Q571.descriptions.fr).equal('document écrit formé de pages reliées entre elles');
        should(simplifiedEntities.Q571.aliases.pl).be.an.Array();
        should(simplifiedEntities.Q571.aliases.pl[0]).equal('księga');
        should(simplifiedEntities.Q571.claims.P279).be.an.Array();
        should(simplifiedEntities.Q571.claims.P279[0]).equal('Q340169');
        should(simplifiedEntities.Q571.sitelinks.afwiki).equal('Boek');
    });
});
//# sourceMappingURL=simplify_entity.js.map