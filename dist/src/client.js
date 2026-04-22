async function fetchJson(url, clientOptions) {
    // Format sdk options to `fetch` RequestInit
    const requestInit = {
        headers: {
            'User-Agent': clientOptions.userAgent || 'wikibase-sdk',
        },
    };
    const res = await fetch(url, requestInit);
    if (!res.ok)
        throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`);
    return res.json();
}
export function buildClient(urlBuilders, clientOptions) {
    const { searchEntities, cirrusSearchPages, getEntities, getManyEntities, getRevisions, getEntityRevision, getEntitiesFromSitelinks, sparqlQuery, getReverseClaims, } = urlBuilders;
    const fetch = (url) => fetchJson(url, clientOptions);
    return {
        searchEntities: (options) => fetch(searchEntities(options)),
        cirrusSearchPages: (options) => fetch(cirrusSearchPages(options)),
        getEntities: (options) => fetch(getEntities(options)),
        getManyEntities: async (options) => {
            const urls = getManyEntities(options);
            const responses = await Promise.all(urls.map(url => fetch(url)));
            return responses.reduce((acc, { entities, error }) => ({
                entities: { ...acc.entities, ...entities },
                errors: error ? [...acc.errors, error] : acc.errors,
            }), { entities: {}, errors: [] });
        },
        getRevisions: (options) => fetch(getRevisions(options)),
        getEntityRevision: (options) => fetch(getEntityRevision(options)),
        getEntitiesFromSitelinks: (options) => fetch(getEntitiesFromSitelinks(options)),
        sparqlQuery: (sparql) => fetch(sparqlQuery(sparql)),
        getReverseClaims: (options) => fetch(getReverseClaims(options)),
    };
}
//# sourceMappingURL=client.js.map