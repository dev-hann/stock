export const stockKeys = {
    all: ['stocks'] as const,
    search: (query: string) => [...stockKeys.all, 'search', query] as const,
};

export const stockDetailKeys = {
    all: ['stock-detail'] as const,
    detail: (symbol: string) => [...stockDetailKeys.all, symbol] as const,
};
