import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import stockUseCase from "@/src/use-cases/stock-use-case";
import useDebounce from "./use-debounce";
import { stockKeys } from "../constants/query-keys";
import Stock from "@/src/domain/stock/stock";
import { SearchState } from "./types";

export default function useStockSearch() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 500); // 500ms debounce

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    // Compute UI state based on data
    const searchState: SearchState = useMemo(() => {
        if (loading) return { type: 'loading' };
        if (error) return { type: 'error', message: '주식 검색에 실패했습니다. 다시 시도해주세요.' };
        if (debouncedQuery && results.length === 0) return { type: 'no-results', query: debouncedQuery };
        if (results.length > 0) return { type: 'results', data: results };
        return { type: 'idle' };
    }, [loading, error, debouncedQuery, results]);

    const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const reset = () => {
        setQuery("");
    }

    return {
        query,
        searchState, // Return computed state instead of raw data
        setQuery,
        onQueryChange,
        search: (q: string) => setQuery(q),
        reset,
        isFocused,
        setIsFocused,
        containerRef,
    };
}
