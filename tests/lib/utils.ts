import { readFileSync } from 'node:fs'
import type { Url } from '../../src/types/options.js'

export function readJsonFile (jsonFilePath: string) {
  return JSON.parse(readFileSync(jsonFilePath, 'utf-8'))
}

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
