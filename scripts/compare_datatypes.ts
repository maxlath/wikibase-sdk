#!/usr/bin/env ts-node
import { kebabCase } from 'lodash-es'
import { red, green } from 'tiny-chalk'
import { DataTypes } from '../src/types/claim.js'
import { isOfType } from '../src/utils/utils.js'
import { readJsonFile } from '../tests/lib/utils.js'

const allDatatypes = readJsonFile('/tmp/all_wikidata_datatypes.json') as string[]
allDatatypes
.map(typeUri => {
  const typeName = typeUri.split('#')[1]
  // Case inconsistency: commonsMedia is camel cased
  if (typeName === 'CommonsMedia') return 'commonsMedia'
  return kebabCase(typeName)
})
.forEach(type => {
  if (isOfType(DataTypes, type)) {
    console.log(green('ok'), type)
  } else {
    console.error(red('unsupported type'), type)
  }
})
