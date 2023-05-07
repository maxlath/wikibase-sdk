import { readFileSync } from 'node:fs';
export function readJsonFile(jsonFilePath) {
    return JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
}
export function objLenght(obj) {
    return Object.keys(obj).length;
}
export function parseQuery(query) {
    return Object.fromEntries(new URLSearchParams(query));
}
export function parseUrlQuery(url) {
    const { searchParams } = new URL(url);
    return searchParams ? Object.fromEntries(searchParams) : {};
}
export function assert(condition) {
    if (!condition)
        throw new Error('not true');
}
//# sourceMappingURL=utils.js.map