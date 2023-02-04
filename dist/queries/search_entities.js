import { rejectObsoleteInterface } from '../utils/utils.js';
const types = ['item', 'property', 'lexeme', 'form', 'sense'];
export const searchEntitiesFactory = (buildUrl) => {
    return function searchEntities({ search, language = 'en', uselang, limit = '20', continue: continu = '0', format = 'json', type = 'item', }) {
        rejectObsoleteInterface(arguments);
        uselang = uselang || language;
        if (!(search && search.length > 0))
            throw new Error("search can't be empty");
        if (!types.includes(type))
            throw new Error(`invalid type: ${type}`);
        return buildUrl({
            action: 'wbsearchentities',
            search,
            language,
            limit,
            continue: continu,
            format,
            uselang,
            type,
        });
    };
};
