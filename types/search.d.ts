export interface SearchResult {
	aliases?: string[]
	concepturi: string;
	description?: string;
	id: string;
	label: string;
	match: {
		language: string;
		text: string;
		type: string;
	};
	pageid: number;
	repository: string;
	title: string;
	url: string;
}
