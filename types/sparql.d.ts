export type SparqlValueRaw = string | number
export type SparqlValueType = SparqlValueRaw | Record<string, SparqlValueRaw>

export interface SparqlResults {
	head: {
		vars: string[];
	};
	results: {
		bindings: any[];
	};
}
