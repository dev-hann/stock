import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import stockUseCase from "@/src/use-cases/stock-use-case";
import useDebounce from "./use-debounce";
import { stockKeys } from "../constants/query-keys";
import Stock from "@/src/domain/stock/stock";

export default function useStockSearch() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500); // 500ms debounce

    const { data: results = [], isLoading: loading, error } = useQuery<Stock[]>({
        queryKey: stockKeys.search(debouncedQuery),
        queryFn: async () => {
            if (!debouncedQuery.trim()) return [];
            const result = await stockUseCase.search(debouncedQuery);
            return result;
        },
        enabled: !!debouncedQuery.trim(), // Only fetch if debounced query is not empty
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const reset = () => {
        setQuery("");
    }

    return {
        query,
        results,
        loading,
        error: error ? "주식 검색에 실패했습니다. 다시 시도해주세요." : (results.length === 0 && debouncedQuery && !loading ? "검색 결과가 없습니다." : null),
        setQuery,
        onQueryChange,
        search: (q: string) => setQuery(q), // Compatibility with existing interface if needed, or just let UI set query directly
        reset,
    };
}
