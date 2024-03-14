const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined';
export function buildUrlFactory(instanceApiEndpoint) {
    return queryObj => {
        // Request CORS headers if the request is made from a browser
        // See https://www.wikidata.org/w/api.php ('origin' parameter)
        if (isBrowser)
            queryObj = Object.assign(Object.assign({}, queryObj), { origin: '*' });
        const queryEntries = Object.entries(queryObj)
            // Remove null or undefined parameters
            .filter(([, value]) => value != null)
            .map(([key, value]) => [key, String(value)]);
        const query = new URLSearchParams(queryEntries).toString();
        return instanceApiEndpoint + '?' + query;
    };
}
//# sourceMappingURL=build_url.js.map