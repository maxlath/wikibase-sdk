import * as wdk from '..';
import {Dictionary} from '../helper.d'

const claimWithQualifier: wdk.Claim = {
	id: 'q42$881F40DC-0AFE-4FEB-B882-79600D234273',
	mainsnak: {
		datatype: 'wikibase-item',
		datavalue: {
			type: 'wikibase-entityid',
			value: {
				'entity-type': 'item',
				id: 'Q533697',
				'numeric-id': 533697,
			},
		},
		hash: 'f22d367759fe126d0723a18e59399e4206b8f37d',
		property: 'P119',
		snaktype: 'value',
	},
	qualifiers: {
		P625: [
			{
				datatype: 'globe-coordinate',
				datavalue: {
					type: 'globecoordinate',
					value: {
						altitude: null,
						globe: 'http://www.wikidata.org/entity/Q2',
						latitude: 51.566516666667,
						longitude: -0.14549722222222,
						precision: 0.0000027777777777778,
					},
				},
				hash: '115724b2b32baa9a00e3c161c1282252ae955964',
				property: 'P625',
				snaktype: 'value',
			},
		],
	},
	'qualifiers-order': [
		'P625',
	],
	rank: 'normal',
	type: 'statement',
}

function simplifyQualifier(): void {
	const qualifiers = claimWithQualifier.qualifiers
	if (!qualifiers) {
		throw new TypeError('not undefined -> help compiler understand')
	}

	const simplifiedQualifier: wdk.ClaimSnakSimplified = wdk.simplify.qualifier(qualifiers.P625[0])
	const simplifiedPropQualifiers: wdk.ClaimSnakSimplified[] = wdk.simplify.propertyQualifiers(qualifiers.P625)
	const simplifiedQualifiers: Dictionary<wdk.ClaimSnakSimplified[]> = wdk.simplify.qualifiers(qualifiers)
}
