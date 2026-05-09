import should from 'should';
import { searchEntitiesFactory } from '../src/queries/search_entities.js';
import { buildUrl } from './lib/tests_env.js';
import { parseUrlQuery } from './lib/utils.js';
const searchEntities = searchEntitiesFactory(buildUrl);
describe('searchEntities', () => {
    describe('action', () => {
        it('action should be wbsearchentities', () => {
            const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }));
            should(query.action).equal('wbsearchentities');
        });
    });
    describe('search', () => {
        it('accepts a string', () => {
            const query = parseUrlQuery(searchEntities({ search: 'johnnybegood' }));
            should(query.search).equal('johnnybegood');
        });
        it('accepts an object', () => {
            const query = parseUrlQuery(searchEntities({ search: 'johnnybegood', language: 'fr' }));
            should(query.search).equal('johnnybegood');
            should(query.language).equal('fr');
        });
        it('throw on empty string', () => {
            should(() => searchEntities({ search: '' })).throw();
        });
        it('should default to continue=0', () => {
            const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }));
            should(query.continue).equal('0');
        });
    });
    describe('language', () => {
        it('should default on language=en', () => {
            const query = parseUrlQuery(searchEntities({
                search: 'Ingmar Bergman',
            }));
            should(query.language).equal('en');
        });
        it('should accept a string', () => {
            const query = parseUrlQuery(searchEntities({
                search: 'Ingmar Bergman',
                language: 'la',
            }));
            should(query.language).equal('la');
        });
        it('should set uselang as language by default', () => {
            const query = parseUrlQuery(searchEntities({
                search: 'Ingmar Bergman',
                language: 'la',
            }));
            should(query.uselang).equal('la');
        });
        it('should accept a uselang parameter different from language', () => {
            // multi-argument interface
            const query = parseUrlQuery(searchEntities({
                search: 'Ingmar Bergman',
                language: 'la',
                uselang: 'eo',
            }));
            should(query.language).equal('la');
            should(query.uselang).equal('eo');
        });
    });
    describe('format', () => {
        it('should have json as default format', () => {
            const query = parseUrlQuery(searchEntities({ search: 'Ingmar Bergman' }));
            should(query.format).equal('json');
        });
    });
    describe('encoding', () => {
        it('should url encode the query', () => {
            const url = searchEntities({ search: 'C#' });
            should(url).containEql('C%23');
        });
    });
    describe('type', () => {
        it('should accept a valid type parameter', () => {
            const query = parseUrlQuery(searchEntities({ search: 'alphabet', type: 'property' }));
            should(query.type).equal('property');
        });
        it('should reject an invalid type parameter', () => {
            // @ts-expect-error invalid type parameter
            should(() => searchEntities({ search: 'alphabet', type: 'foo' })).throw();
        });
    });
    describe('limit', () => {
        it('should reject an invalid type parameter', () => {
            const query = parseUrlQuery(searchEntities({ search: 'alphabet', limit: 10 }));
            should(query.limit).equal('10');
        });
    });
    describe('continue', () => {
        it('should reject an invalid type parameter', () => {
            const query = parseUrlQuery(searchEntities({ search: 'alphabet', continue: 10 }));
            should(query.continue).equal('10');
        });
    });
});
//# sourceMappingURL=search_entities.js.map