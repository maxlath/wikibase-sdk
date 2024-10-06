import { readFileSync } from 'fs';
export function readJsonFile(jsonFilePath) {
    return JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
}
export function objLenght(obj) {
    return Object.keys(obj).length;
}
export function parseQuery(query) {
    const searchParams = new URLSearchParams(query);
    const result = {};
    for (const [key, value] of searchParams) {
        result[key] = value;
    }
    return result;
}
export function parseUrlQuery(url) {
    const { searchParams } = new URL(url);
    const result = {};
    for (const [key, value] of searchParams) {
        result[key] = value;
    }
    return result;
}
export function assert(condition) {
    if (!condition)
        throw new Error('not true');
}
export function assertPlainObject(obj) {
    return assert(typeof obj === 'object' && obj !== null && !(obj instanceof Array));
}
//# sourceMappingURL=utils.js.map