#!/usr/bin/env tsx
import { kebabCase } from 'lodash-es';
import { red, green } from 'tiny-chalk';
import { parsers } from '../src/helpers/parse_snak.js';
import { readJsonFile } from '../tests/lib/utils.js';
const supportedTypes = Object.keys(parsers);
const allDatatypes = readJsonFile('/tmp/all_wikidata_datatypes.json');
allDatatypes
    .map(typeUri => {
    const typeName = typeUri.split('#')[1];
    // Case inconsistency: commonsMedia is camel cased
    if (typeName === 'CommonsMedia')
        return 'commonsMedia';
    return kebabCase(typeName);
})
    .forEach(type => {
    if (supportedTypes.includes(type)) {
        console.log(green('ok'), type);
    }
    else {
        console.error(red('unsupported type'), type);
    }
});
//# sourceMappingURL=compare_datatypes.js.map