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
  const debouncedQuery = useDebounce(query, 500);

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

  const {
    data: results = [],
    isLoading: loading,
    error,
  } = useQuery<Stock[]>({
    queryKey: stockKeys.search(debouncedQuery),
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const result = await stockUseCase.search(debouncedQuery);
      return result;
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 1000 * 60 * 5,
    gcTime: 0,
    retry: 1,
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const searchState: SearchState = useMemo(() => {
    if (loading) return { type: "loading" };
    if (error) {
      // Check if it's a rate limit error
      const err = error as Error & { status?: number };
      if (err.status === 429) {
        return {
          type: "error",
          message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        };
      }
      return {
        type: "error",
        message: "주식 검색에 실패했습니다. 다시 시도해주세요.",
      };
    }
    if (debouncedQuery && results.length === 0)
      return { type: "no-results", query: debouncedQuery };
    if (results.length > 0) return { type: "results", data: results };
    return { type: "idle" };
  }, [loading, error, debouncedQuery, results]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const reset = () => {
    setQuery("");
  };

  return {
    query,
    searchState,
    setQuery,
    onQueryChange,
    reset,
    isFocused,
    setIsFocused,
    containerRef,
  };
}
