import {Claim, ClaimSimplified} from './claim.d'
import {Dictionary} from './helper'

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
	aliases?: Dictionary<LanguageEntry[]>;
	claims?: Dictionary<Claim[]>;
	descriptions?: Dictionary<LanguageEntry>;
	labels?: Dictionary<LanguageEntry>;
	sitelinks?: Dictionary<Sitelink>;
}

export interface EntitySimplified {
	type: string;
	id: string;

	// Info
	modified?: string;

	aliases?: Dictionary<string[]>;
	claims?: Dictionary<ClaimSimplified[]>;
	descriptions?: Dictionary<string>;
	labels?: Dictionary<string>;
	sitelinks?: {[site: string]: string};
}

export interface Sitelink {
	site: string;
	title: string;
	badges: string[];
	url?: string;
}
