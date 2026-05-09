import should from 'should';
import { simplifyAliases, simplifyDescriptions, simplifyLabels } from '../src/helpers/simplify_text_attributes.js';
import { Q571 } from './data/Q571.js';
import { objLenght } from './lib/utils.js';
describe('simplifyLabels', () => {
    it('should simplify labels', () => {
        const simplifiedLabels = simplifyLabels(Q571.labels);
        should(simplifiedLabels.en).equal('book');
        should(simplifiedLabels.fr).equal('livre');
        should(objLenght(simplifiedLabels)).equal(objLenght(Q571.labels));
    });
    it('should create a different object', () => {
        // @ts-expect-error they are not the same
        should(simplifyLabels(Q571.labels) === Q571.labels).be.false();
    });
    it('should not crash when the simplified attribute is null', () => {
        // This might be the case if a tool was requested entity.labels.en
        // and set it to null in absence of value
        // Known case in wikibase-cli: wd data --props labels.en --simplify
        const entityWithNullEnLabel = { labels: { en: null } };
        should(simplifyLabels(entityWithNullEnLabel.labels)).deepEqual({ en: null });
    });
});
describe('simplifyDescriptions', () => {
    it('should simplify descriptions', () => {
        const simplifiedDescriptions = simplifyDescriptions(Q571.descriptions);
        should(simplifiedDescriptions.en.slice(0, 23)).equal('medium for recording in');
        should(simplifiedDescriptions.fr.slice(0, 14)).equal('document écrit');
        should(objLenght(simplifiedDescriptions)).equal(objLenght(Q571.descriptions));
    });
    it('should create a different object', () => {
        // @ts-expect-error they are not the same
        should(simplifyLabels(Q571.descriptions) === Q571.descriptions).be.false();
    });
});
describe('simplifyAliases', () => {
    it('should simplify aliases', () => {
        const simplifiedAliases = simplifyAliases(Q571.aliases);
        should(objLenght(simplifiedAliases.en)).equal(objLenght(Q571.aliases.en));
        should(objLenght(simplifiedAliases.fr)).equal(objLenght(Q571.aliases.fr));
        should(simplifiedAliases.en[0]).equal('books');
        should(simplifiedAliases.fr[0]).equal('ouvrage');
        should(objLenght(simplifiedAliases)).equal(objLenght(Q571.aliases));
    });
    it('should create a different object', () => {
        // @ts-expect-error they are not the same
        should(simplifyAliases(Q571.aliases) === Q571.aliases).be.false();
    });
});
//# sourceMappingURL=simplify_text_attributes.js.map