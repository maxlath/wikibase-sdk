import * as wdk from '..';
import {Dictionary} from '../helper.d'

const searchUrl: string = wdk.searchEntities('erde', 'de', 42, 'xml', 'de');

const entityUrl: string = wdk.getEntities('Q5', 'de', ['labels', 'claims']);

const queryUrl: string = wdk.sparqlQuery('SELECT * FROM {}');

const entity: wdk.Entity = {
	datatype: 'wikibase-item',
	id: 'P31',
	labels: {
		en: {
			language: 'en',
			value: 'instance of',
		},
	},
	type: 'property',
};

const simplifiedEntitiy: wdk.EntitySimplified = wdk.simplify.entity(entity);

const simplifiedEntities = wdk.simplify.entities({P31: entity});

const claim: wdk.Claim = {
	id: 'Q42$88CB3380-ADFB-427B-87E5-C8D537545FE8',
	mainsnak: {
		datatype: 'monolingualtext',
		datavalue: {
			type: 'monolingualtext',
			value: {
				language: 'en',
				text: 'Douglas Adams',
			},
		},
		hash: '95644e72f595a3bc535e0eb316325ee88d9466f8',
		property: 'P1559',
		snaktype: 'value',
	},
	rank: 'normal',
	type: 'statement',
}

const simplifiedClaim: wdk.ClaimSimplified = wdk.simplify.claim(claim)

const simplifiedPropClaims: wdk.ClaimSimplified[] = wdk.simplify.propertyClaims([claim])

const simplifiedClaims: Dictionary<wdk.ClaimSimplified[]> = wdk.simplify.claims({P1559: [claim]})
