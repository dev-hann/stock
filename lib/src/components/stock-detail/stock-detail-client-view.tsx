"use client";

import { useQuery } from "@tanstack/react-query";
import StockDetail from "@/src/domain/stock/stock-detail";
import StockDetailCard from "./stock-detail-card";
import LoadingView from "../common/loading-view";
import ErrorView from "../common/error-view";
import stockUseCase from "@/src/use-cases/stock-use-case";
import { stockDetailKeys } from "@/src/constants/query-keys";
import Link from "next/link";

interface StockDetailClientViewProps {
  symbol: string;
}

export default function StockDetailClientView({
  symbol,
}: StockDetailClientViewProps) {
  // Stock detail query - will use hydrated data from server
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery<StockDetail>({
    queryKey: stockDetailKeys.detail(symbol),
    queryFn: async () => {
      return stockUseCase.getDetail(symbol);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - match server cache
  });

  if (isLoading) {
    return <LoadingView message="Loading stock details..." />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to load stock details"
        message="Please try again later"
      />
    );
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Back to Search Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Search
      </Link>

      <StockDetailCard detail={detail} symbol={symbol} />
    </div>
  );
}
