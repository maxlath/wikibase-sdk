import type { WmLanguageCode } from '../types/options.js'

// Ex: keep only 'fr' in 'fr_FR'
export function shortLang (language: string): WmLanguageCode {
  const lang = language.toLowerCase().split('_')[0] as WmLanguageCode
  return lang
}

// a polymorphism helper:
// accept either a string or an array and return an array
export function forceArray (array): string[] {
  if (typeof array === 'string') array = [ array ]
  return array || []
}

// simplistic implementation to filter-out arrays
export const isPlainObject = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object' || obj instanceof Array) return false
  return true
}

// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
export const fixedEncodeURIComponent = (str: string): string => {
  return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
}

export const replaceSpaceByUnderscores = (str: string): string => str.replace(/\s/g, '_')

export const uniq = (array: string[]): string[] => Array.from(new Set(array))

const encodeCharacter = (char: string): string => '%' + char.charCodeAt(0).toString(16)

export function rejectObsoleteInterface (args): void {
  if (args.length !== 1 || !isPlainObject(args[0])) {
    throw new Error(`Since wikibase-sdk v9.0.0, this function expects arguments to be passed in an object
    See https://github.com/maxlath/wikibase-sdk/blob/main/CHANGELOG.md`)
  }
}
