export function isNumericId(id: string): boolean;
export function isEntityId(id: string): boolean;
export function isItemId(id: string): boolean;
export function isPropertyId(id: string): boolean;
export function isFormId(id: string): boolean;
export function isSenseId(id: string): boolean;
export function isGuid(guid: string): boolean;

export function isEntityPageTitle(title: string): boolean;

export function getNumericId(id: string): number;

export function wikibaseTimeToDateObject(wikidataTime: string): Date;
export function wikibaseTimeToEpochTime(wikidataTime: string): number;
export function wikibaseTimeToISOString(wikidataTime: string): string;
export function wikibaseTimeToSimpleDay(wikidataTime: string): string;

export function getImageUrl(filename: string, width?: number): string;
