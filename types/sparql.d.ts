import {Dictionary} from './helper'

export type SparqlValueRaw = string | number
export type SparqlValueType = SparqlValueRaw | Dictionary<SparqlValueRaw>

export interface SparqlResults {
	head: {
		vars: string[];
	};
	results: {
		bindings: any[];
	};
}
