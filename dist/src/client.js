export async function fetchJson(url, clientOptions) {
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
        searchEntities(options) {
            return fetch(searchEntities(options));
        },
        cirrusSearchPages(options) {
            return fetch(cirrusSearchPages(options));
        },
        getEntities(options) {
            return fetch(getEntities(options));
        },
        async getManyEntities(options) {
            const urls = getManyEntities(options);
            const aggregatedResponse = { entities: {}, errors: [] };
            for (const url of urls) {
                const { entities, error } = await fetch(url);
                Object.assign(aggregatedResponse.entities, entities);
                if (error)
                    aggregatedResponse.errors.push(error);
            }
            return aggregatedResponse;
        },
        getRevisions(options) {
            return fetch(getRevisions(options));
        },
        getEntityRevision(options) {
            return fetch(getEntityRevision(options));
        },
        getEntitiesFromSitelinks(options) {
            return fetch(getEntitiesFromSitelinks(options));
        },
        sparqlQuery(sparql) {
            return fetch(sparqlQuery(sparql));
        },
        getReverseClaims(options) {
            return fetch(getReverseClaims(options));
        },
    };
}
//# sourceMappingURL=client.js.map