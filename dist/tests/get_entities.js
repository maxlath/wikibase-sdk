import should from 'should';
import { getEntitiesFactory } from '../src/queries/get_entities.js';
import { buildUrl } from './lib/tests_env.js';
import { parseUrlQuery } from './lib/utils.js';
const getEntities = getEntitiesFactory(buildUrl);
describe('wikidata getEntities', () => {
    describe('polymorphism', () => {
        it('rejects parameters as multiple arguments', () => {
            // @ts-expect-error parameters as multiple arguments
            should(() => getEntities('Q1', 'fr', 'info', 'json')).throw();
        });
        it('accepts parameters as a unique object argument', () => {
            const url = getEntities({
                ids: 'Q1',
                languages: 'fr',
                props: 'info',
                format: 'json',
            });
            const query = parseUrlQuery(url);
            should(query.ids).equal('Q1');
            should(query.languages).equal('fr');
            should(query.props).equal('info');
            should(query.format).equal('json');
        });
    });
    describe('action', () => {
        it('action should be wbgetentities', () => {
            const query = parseUrlQuery(getEntities({ ids: ['Q1'] }));
            should(query.action).equal('wbgetentities');
        });
    });
    describe('ids', () => {
        it('should reject invalid ids', () => {
            // @ts-expect-error invalid id
            should(() => getEntities({ ids: 'foo' })).throw('invalid entity id: foo (type: string)');
        });
        it('accepts one id as a string', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535' }));
            should(query.ids).equal('Q535');
        });
        it('accepts ids as an array', () => {
            const query = parseUrlQuery(getEntities({ ids: ['Q535', 'Q7546'] }));
            should(query.ids).equal('Q535|Q7546');
        });
        it('accepts all supported entities types', () => {
            const query = parseUrlQuery(getEntities({ ids: ['Q535', 'P123', 'L525'] }));
            should(query.ids).equal('Q535|P123|L525');
        });
    });
    describe('languages', () => {
        it('defaults to no language parameter', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535' }));
            should(query.languages).not.be.ok();
        });
        it('accepts one language as a string', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535', languages: 'fr' }));
            should(query.languages).equal('fr');
        });
        it('accepts language as an array', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535', languages: ['fr', 'de'] }));
            should(query.languages).equal('fr|de');
        });
    });
    describe('props', () => {
        it('defaults to no property specified', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535' }));
            should(query.props).not.be.ok();
        });
        it('include the requested property', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q702741', props: 'claims' }));
            should(query.props).equal('claims');
        });
        it('include the requested properties', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q702741', props: ['claims', 'info'] }));
            should(query.props).equal('claims|info');
        });
    });
    describe('format', () => {
        it('defaults to json', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535' }));
            should(query.format).equal('json');
        });
    });
    describe('redirects', () => {
        it('should default to no redirects parameter', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535' }));
            should(query.redirects).not.be.ok();
        });
        it('should add a redirects parameter if false', () => {
            const query = parseUrlQuery(getEntities({ ids: 'Q535', redirects: false }));
            should(query.redirects).equal('no');
        });
    });
});
//# sourceMappingURL=get_entities.js.map