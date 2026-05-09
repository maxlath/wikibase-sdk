import should from 'should';
import { cirrusSearchPagesFactory } from '../src/queries/cirrus_search.js';
import { buildUrl } from './lib/tests_env.js';
import { parseUrlQuery } from './lib/utils.js';
const cirrusSearchPages = cirrusSearchPagesFactory(buildUrl);
describe('cirrusSearchPages', () => {
    it('should generate a URL with the query/search endpoint', () => {
        const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
        should(query.action).equal('query');
        should(query.list).equal('search');
        should(query.srsearch).equal('hello');
        should(query.srlimit).not.be.ok();
        should(query.srnamespace).not.be.ok();
        should(query.sroffset).not.be.ok();
        should(query.srqiprofile).not.be.ok();
        should(query.srsort).not.be.ok();
    });
    it('should accept only the object interface', () => {
        // @ts-expect-error invalid argument
        should(() => cirrusSearchPages('hello')).throw();
    });
    describe('haswbstatement', () => {
        it('should accept a statement argument', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', haswbstatement: 'P31=Q5' }));
            should(query.srsearch).equal('hello haswbstatement:P31=Q5');
        });
        it('should accept a statement argument alone', () => {
            const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: 'P31=Q5' }));
            should(query.srsearch).equal('haswbstatement:P31=Q5');
        });
        it('should accept an array of statements', () => {
            const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: ['P31=Q5', 'P279=Q2934'] }));
            should(query.srsearch).equal('haswbstatement:P31=Q5 haswbstatement:P279=Q2934');
        });
        it('should accept negative statements', () => {
            const query = parseUrlQuery(cirrusSearchPages({ haswbstatement: '-P31=Q5' }));
            should(query.srsearch).equal('-haswbstatement:P31=Q5');
            const query2 = parseUrlQuery(cirrusSearchPages({ haswbstatement: ['P31=Q5', '-P279=Q2934'] }));
            should(query2.srsearch).equal('haswbstatement:P31=Q5 -haswbstatement:P279=Q2934');
        });
    });
    describe('format', () => {
        it('should default to json', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.format).equal('json');
        });
        it('should accept a custom format', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', format: 'xml' }));
            should(query.format).equal('xml');
        });
    });
    describe('namespace', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.srnamespace).not.be.ok();
        });
        it('should accept a single namespace number', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: 0 }));
            should(query.srnamespace).equal('0');
        });
        it('should accept a single namespace string', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: '0' }));
            should(query.srnamespace).equal('0');
        });
        it('should accept multiple namespaces as a string', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: '0|1' }));
            should(query.srnamespace).equal('0|1');
        });
        it('should accept multiple namespaces as an array', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', namespace: [0, 1] }));
            should(query.srnamespace).equal('0|1');
        });
        it('should reject an invalid namespace', () => {
            should(() => cirrusSearchPages({ search: 'hello', namespace: 'foo' })).throw(/invalid namespace/);
        });
    });
    describe('limit', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.srlimit).not.be.ok();
        });
        it('should accept a custom limit', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', limit: 10 }));
            should(query.srlimit).equal('10');
        });
        it('should reject an invalid limit', () => {
            should(() => cirrusSearchPages({ search: 'hello', limit: 'foo' })).throw(/invalid limit/);
        });
    });
    describe('offset', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.sroffset).not.be.ok();
        });
        it('should accept a custom offset', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', offset: 10 }));
            should(query.sroffset).equal('10');
        });
        it('should reject an invalid offset', () => {
            should(() => cirrusSearchPages({ search: 'hello', offset: 'foo' })).throw(/invalid offset/);
        });
    });
    describe('profile', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.srqiprofile).not.be.ok();
        });
        it('should accept a profile', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', profile: 'wikibase_prefix_boost' }));
            should(query.srqiprofile).equal('wikibase_prefix_boost');
        });
        it('should reject an invalid profile', () => {
            // @ts-expect-error invalid argument
            should(() => cirrusSearchPages({ search: 'hello', profile: 123 })).throw(/invalid profile/);
        });
    });
    describe('sort', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.srsort).not.be.ok();
        });
        it('should accept a sort', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', sort: 'last_edit_desc' }));
            should(query.srsort).equal('last_edit_desc');
        });
        it('should reject an invalid sort', () => {
            // @ts-expect-error invalid argument
            should(() => cirrusSearchPages({ search: 'hello', sort: 123 })).throw(/invalid sort/);
        });
    });
    describe('prop', () => {
        it('should default to not being set', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello' }));
            should(query.srprop).not.be.ok();
        });
        it('should accept a prop', () => {
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', prop: 'snippet|titlesnippet|sectiontitle' }));
            should(query.srprop).equal('snippet|titlesnippet|sectiontitle');
        });
        it('should accept a srprop', () => {
            // @ts-expect-error deprecated argument name
            const query = parseUrlQuery(cirrusSearchPages({ search: 'hello', srprop: 'snippet|titlesnippet|sectiontitle' }));
            should(query.srprop).equal('snippet|titlesnippet|sectiontitle');
        });
    });
});
//# sourceMappingURL=cirrus_search.js.map