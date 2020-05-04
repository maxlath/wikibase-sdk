import WBK from '..';

const wbk = WBK({
	instance: '',
	sparqlEndpoint: ''
})


const searchUrl: string = wbk.searchEntities('erde', 'de', 42, 'xml', 'de');

const entityUrl: string = wbk.getEntities('Q5', 'de', ['labels', 'claims']);

const queryUrl: string = wbk.sparqlQuery('SELECT * FROM {}');
