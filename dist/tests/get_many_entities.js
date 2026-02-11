import { range } from 'lodash-es';
import should from 'should';
import { getManyEntitiesFactory } from '../src/queries/get_many_entities.js';
import { buildUrl } from './lib/tests_env.js';
import { parseUrlQuery } from './lib/utils.js';
const getManyEntities = getManyEntitiesFactory(buildUrl);
const manyIds = range(1, 80).map(id => `Q${id}`);
describe('wikidata getManyEntities', () => {
    describe('general', () => {
        it('should reject invalid ids', () => {
            // @ts-expect-error id is not an EntityId
            should(() => getManyEntities({ ids: ['foo'] })).throw('invalid entity id: foo (type: string)');
        });
        it('should return an array of urls', () => {
            const urls = getManyEntities({ ids: manyIds });
            should(urls).be.an.Array();
            urls.forEach(url => should(/^https/.test(url)).be.true());
        });
    });
    describe('polymorphism', () => {
        it('should reject parameters as multiple arguments', () => {
            // @ts-expect-error old syntax
            should(() => getManyEntities(manyIds, 'fr', 'info', 'json')).throw();
        });
        it('should accept parameters as a unique object argument', () => {
            const urls = getManyEntities({
                ids: manyIds,
                languages: 'fr',
                props: 'labels',
                format: 'xml',
            });
            should(urls).be.an.Array();
            urls.forEach(url => {
                const query = parseUrlQuery(url);
                should(query.ids).startWith('Q');
                should(query.languages).equal('fr');
                should(query.props).equal('labels');
                should(query.format).equal('xml');
            });
        });
    });
    describe('ids', () => {
        it('should throw if passed an id string', () => {
            // @ts-expect-error id as string and not string[]
            should(() => getManyEntities({ ids: 'Q535' })).throw();
        });
    });
    describe('redirects', () => {
        it('should default to no redirects parameter', () => {
            const urls = getManyEntities({ ids: ['Q535'] });
            should(urls[0].match('redirects')).not.be.ok();
        });
        it('should add a redirects parameter if false', () => {
            const urls = getManyEntities({ ids: ['Q535'], redirects: false });
            const url = urls[0];
            should(parseUrlQuery(url).redirects).equal('no');
        });
    });
});
//# sourceMappingURL=get_many_entities.js.map