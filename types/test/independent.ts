import {Entity, EntitySimplified, Claim, ClaimSimplified, simplify, isEntityId} from '..';

isEntityId('Q1337');

const entity: Entity = {
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

const simplifiedEntitiy: EntitySimplified = simplify.entity(entity);

const simplifiedEntities = simplify.entities({P31: entity});

const claim: Claim = {
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

const simplifiedClaim: ClaimSimplified = simplify.claim(claim)

const simplifiedPropClaims: ClaimSimplified[] = simplify.propertyClaims([claim])

const simplifiedClaims: Record<string, ClaimSimplified[]> = simplify.claims({P1559: [claim]})
