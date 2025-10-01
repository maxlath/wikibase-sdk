import { typedKeys } from '../utils/utils.js';
import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay } from './time.js';
function parseStringValue(datavalue) {
    return datavalue.value;
}
function parseMonolingualTextValue(datavalue, options) {
    return options.keepRichValues ? datavalue.value : datavalue.value.text;
}
function parseEntityValue(datavalue, options) {
    const { entityPrefix: prefix } = options;
    const { value } = datavalue;
    let id;
    if (value.id) {
        id = value.id;
    }
    else {
        // Legacy
        const letter = entityLetter[value['entity-type']];
        id = `${letter}${value['numeric-id']}`;
    }
    return typeof prefix === 'string' ? `${prefix}:${id}` : id;
}
const entityLetter = {
    item: 'Q',
    'entity-schema': 'E',
    lexeme: 'L',
    property: 'P',
    form: 'F',
    sense: 'S',
};
function parseQuantityValue(datavalue, options) {
    const { value } = datavalue;
    const amount = parseFloat(value.amount);
    if (options.keepRichValues) {
        const richValue = {
            amount: parseFloat(value.amount),
            // ex: http://www.wikidata.org/entity/
            unit: value.unit.replace(/^https?:\/\/.*\/entity\//, ''),
        };
        if (value.upperBound != null)
            richValue.upperBound = parseFloat(value.upperBound);
        if (value.lowerBound != null)
            richValue.lowerBound = parseFloat(value.lowerBound);
        return richValue;
    }
    else {
        return amount;
    }
}
function parseGlobeCoordinateValue(datavalue, options) {
    if (options.keepRichValues) {
        return datavalue.value;
    }
    else {
        return [datavalue.value.latitude, datavalue.value.longitude];
    }
}
function parseTimeValue(datavalue, options) {
    let timeValue;
    if (typeof options.timeConverter === 'function') {
        timeValue = options.timeConverter(datavalue.value);
    }
    else {
        timeValue = getTimeConverter(options.timeConverter)(datavalue.value);
    }
    if (options.keepRichValues) {
        const { timezone, before, after, precision, calendarmodel } = datavalue.value;
        return { time: timeValue, timezone, before, after, precision, calendarmodel };
    }
    else {
        return timeValue;
    }
}
// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
export const timeConverters = {
    iso: wikibaseTimeToISOString,
    epoch: wikibaseTimeToEpochTime,
    'simple-day': wikibaseTimeToSimpleDay,
    none: (wikibaseTime) => typeof wikibaseTime === 'string' ? wikibaseTime : wikibaseTime.time,
};
function getTimeConverter(key = 'iso') {
    const converter = timeConverters[key];
    if (!converter)
        throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`);
    return converter;
}
export const parsersByDatavalueTypes = {
    globecoordinate: parseGlobeCoordinateValue,
    monolingualtext: parseMonolingualTextValue,
    quantity: parseQuantityValue,
    string: parseStringValue,
    time: parseTimeValue,
    'wikibase-entityid': parseEntityValue,
};
export const datavalueTypeBySnakDatatype = {
    commonsMedia: 'string',
    edtf: 'string', // See https://github.com/ProfessionalWiki/WikibaseEdtf
    'external-id': 'string',
    'entity-schema': 'wikibase-entityid',
    'geo-shape': 'string',
    'globe-coordinate': 'globecoordinate',
    localMedia: 'string', // See https://github.com/ProfessionalWiki/WikibaseLocalMedia
    math: 'string',
    mediainfo: 'wikibase-entityid',
    monolingualtext: 'monolingualtext',
    'musical-notation': 'string',
    quantity: 'quantity',
    string: 'string',
    'tabular-data': 'string',
    time: 'time',
    url: 'string',
    'wikibase-form': 'wikibase-entityid',
    'wikibase-item': 'wikibase-entityid',
    'wikibase-lexeme': 'wikibase-entityid',
    'wikibase-property': 'wikibase-entityid',
    'wikibase-sense': 'wikibase-entityid',
};
export function parseSnakDatavalue(datavalue, options) {
    const parser = parsersByDatavalueTypes[datavalue.type];
    if (!parser) {
        throw new Error(`${datavalue.type} datavalue parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`);
    }
    // @ts-expect-error
    return parser(datavalue, options);
}
export const datatypes = typedKeys(datavalueTypeBySnakDatatype);
//# sourceMappingURL=parse_snak.js.map