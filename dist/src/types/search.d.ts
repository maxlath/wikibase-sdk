export interface SearchResult {
    aliases?: string[];
    concepturi: string;
    description?: string;
    id: string;
    label: string;
    match: {
        language: string;
        text: string;
        type: string;
    };
    pageid: number;
    repository: string;
    title: string;
    url: string;
}
export interface SearchResponse {
    search: SearchResult[];
    'search-continue': number;
    searchinfo: {
        search: string;
    };
    success: number;
    error?: {
        code: string;
        info: string;
        '*': string;
    };
    servedby: string;
}
//# sourceMappingURL=search.d.ts.map