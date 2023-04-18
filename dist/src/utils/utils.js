/** Example: keep only 'fr' in 'fr_FR' */
export function shortLang(language) {
    const lang = language.toLowerCase().split('_')[0];
    return lang;
}
/**
 * a polymorphism helper:
 * accept either a string or an array and return an array
 */
export function forceArray(array) {
    if (typeof array === 'string') {
        return [array];
    }
    if (Array.isArray(array)) {
        // TODO: return readonly array
        return [...array];
    }
    return [];
}
/** simplistic implementation to filter-out arrays */
export function isPlainObject(obj) {
    return Boolean(obj) && typeof obj === 'object' && !Array.isArray(obj);
}
// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
export const fixedEncodeURIComponent = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
};
export const replaceSpaceByUnderscores = (str) => str.replace(/\s/g, '_');
export function uniq(array) {
    return Array.from(new Set(array));
}
const encodeCharacter = (char) => '%' + char.charCodeAt(0).toString(16);
export function rejectObsoleteInterface(args) {
    if (args.length !== 1 || !isPlainObject(args[0])) {
        throw new Error(`Since wikibase-sdk v9.0.0, this function expects arguments to be passed in an object
    See https://github.com/maxlath/wikibase-sdk/blob/main/CHANGELOG.md`);
    }
}
/**
 * Checks if the `element` is of one of the entries of `all`
 * @example const isWmLanguageCode: lang is WmLanguageCode = isOfType(languages, lang)
 */
export function isOfType(all, element) {
    return typeof element === 'string' && all.includes(element);
}
//# sourceMappingURL=utils.js.map