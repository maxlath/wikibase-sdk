import { buildUrlFactory } from '../../src/utils/build_url.js';
export const instance = 'https://www.wikidata.org';
export const wgScriptPath = 'w';
const instanceApiEndpoint = `${instance}/${wgScriptPath}/api.php`;
export const sparqlEndpoint = 'https://query.wikidata.org/sparql';
export const buildUrl = buildUrlFactory(instanceApiEndpoint);
//# sourceMappingURL=tests_env.js.map