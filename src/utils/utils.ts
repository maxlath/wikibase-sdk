/** Example: keep only 'de' in 'de_CH' or 'de-ch' */
export function shortLang (language: string): string {
  return language.toLowerCase().split(/_-/)[0]
}

/**
 * a polymorphism helper:
 * accept either a string or an array and return an array
 */
export function forceArray<T extends string> (array: T | readonly T[] | undefined): T[] {
  if (typeof array === 'string') {
    return [ array ]
  }

  if (Array.isArray(array)) {
    // TODO: return readonly array
    return [ ...array ]
  }

  return []
}

/** simplistic implementation to filter-out arrays */
export function isPlainObject (obj: unknown): boolean {
  return Boolean(obj) && typeof obj === 'object' && !Array.isArray(obj)
}

// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
export const fixedEncodeURIComponent = (str: string): string => {
  return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
}

export const replaceSpaceByUnderscores = (str: string): string => str.replace(/\s/g, '_')

export function uniq<T> (array: readonly T[]): T[] {
  return Array.from(new Set(array))
}

const encodeCharacter = (char: string): string => '%' + char.charCodeAt(0).toString(16)

export function rejectObsoleteInterface (args: IArguments): void {
  if (args.length !== 1 || !isPlainObject(args[0])) {
    throw new Error(`Since wikibase-sdk v9.0.0, this function expects arguments to be passed in an object
    See https://github.com/maxlath/wikibase-sdk/blob/main/CHANGELOG.md`)
  }
}

/**
 * Checks if the `element` is of one of the entries of `all`
 * @example const isLanguage: lang is Language = isOfType(languages, lang)
 */
export function isOfType<T extends string> (all: readonly T[], element: unknown): element is T {
  return typeof element === 'string' && (all as readonly string[]).includes(element)
}

/** key is a key on the object */
export function isAKey<T extends PropertyKey> (obj: Readonly<Partial<Record<T, unknown>>>, key: PropertyKey): key is T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/** like Object.entries() but with typed key */
export function typedEntries<K extends string, V> (input: Readonly<Partial<Record<K, V>>>): Array<[K, V]> {
  // @ts-expect-error string is not assignable to K as K is more specific
  return Object.entries(input)
}
