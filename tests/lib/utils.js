import { createRequire } from 'module'

// Importing JSON is still experimental in Node v18 https://nodejs.org/api/esm.html#import-assertions
// so ESlint doesn't support it and complains with "Parsing error: Unexpected token assert"
// thus this work around to require json files the old CommonJS way
// See https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
export const requireJson = (requiringUrl, jsonFilePath) => createRequire(requiringUrl)(jsonFilePath)

export const objLenght = obj => Object.keys(obj).length

export const parseQuery = query => Object.fromEntries(new URLSearchParams(query))

export const parseUrlQuery = url => {
  const { searchParams } = new URL(url)
  return searchParams ? Object.fromEntries(searchParams) : {}
}
