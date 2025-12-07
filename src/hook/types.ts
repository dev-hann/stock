import Stock from "@/src/domain/stock/stock";

export type SearchState =
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'error'; message: string }
    | { type: 'no-results'; query: string }
    | { type: 'results'; data: Stock[] };
