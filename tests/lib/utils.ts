import { createRequire } from 'module'
import type { Url } from '../../src/types/options.js'

// Importing JSON is still experimental in Node v18 https://nodejs.org/api/esm.html#import-assertions
// so ESlint doesn't support it and complains with "Parsing error: Unexpected token assert"
// thus this work around to require json files the old CommonJS way
// See https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
export const requireJson = (requiringUrl: string | URL, jsonFilePath: string) => createRequire(requiringUrl)(jsonFilePath)

export function objLenght<K extends string | number | symbol> (obj: Partial<Readonly<Record<K, unknown>>>) {
  return Object.keys(obj).length
}

export function parseQuery (query: string | string[][] | Record<string, string> | URLSearchParams) {
  return Object.fromEntries(new URLSearchParams(query))
}

export function parseUrlQuery (url: Url) {
  const { searchParams } = new URL(url)
  return searchParams ? Object.fromEntries(searchParams) : {}
}
