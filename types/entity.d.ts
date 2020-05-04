import {Claim, ClaimSimplified} from './claim.d'

export interface LanguageEntry {
	language: string;
	value: string;
}

export interface Entity {
	type: string;
	datatype?: string;
	id: string;

	// Info
	pageid?: number;
	ns?: number;
	title?: string;
	lastrevid?: number;
	modified?: string;
	redirects?: {from: string, to: string};

	// Available when asked for in GetEntitiesOptions
	aliases?: Record<string, LanguageEntry[]>;
	claims?: Record<string, Claim[]>;
	descriptions?: Record<string, LanguageEntry>;
	labels?: Record<string, LanguageEntry>;
	sitelinks?: Record<string, Sitelink>;
}

export interface EntitySimplified {
	type: string;
	id: string;

	// Info
	modified?: string;

	aliases?: Record<string, string[]>;
	claims?: Record<string, ClaimSimplified[]>;
	descriptions?: Record<string, string>;
	labels?: Record<string, string>;
	sitelinks?: {[site: string]: string};
}

export interface Sitelink {
	site: string;
	title: string;
	badges: string[];
	url?: string;
}
