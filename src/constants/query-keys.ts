export const stockKeys = {
    all: ["stock"] as const,
    search: (query: string) => [...stockKeys.all, "search", query] as const,
};
