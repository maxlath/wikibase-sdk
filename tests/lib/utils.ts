import { readFileSync } from 'fs'
import type { Url } from '../../src/utils/build_url.js'

export function readJsonFile (jsonFilePath: string) {
  return JSON.parse(readFileSync(jsonFilePath, 'utf-8'))
}

export function objLenght<K extends string | number | symbol> (obj: Partial<Readonly<Record<K, unknown>>>) {
  return Object.keys(obj).length
}

export function parseQuery (query: string | string[][] | Record<string, string> | URLSearchParams) {
  const searchParams = new URLSearchParams(query)
  const result: Record<string, string> = {}
  for (const [ key, value ] of searchParams) {
    result[key] = value
  }

  return result
}

export function parseUrlQuery (url: Url) {
  const { searchParams } = new URL(url)
  const result: Record<string, string> = {}
  for (const [ key, value ] of searchParams) {
    result[key] = value
  }
  return result
}

export function assert (condition: boolean): asserts condition {
  if (!condition) throw new Error('not true')
}

export function assertPlainObject (obj) {
  return assert(typeof obj === 'object' && obj !== null && !(obj instanceof Array))
}
