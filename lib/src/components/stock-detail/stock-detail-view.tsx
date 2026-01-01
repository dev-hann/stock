import useStockDetail from "@/src/hook/use-stock-detail";
import StockDetailCard from "./stock-detail-card";
import LoadingView from "../common/loading-view";
import ErrorView from "../common/error-view";

interface StockDetailViewProps {
  symbol: string;
}

export default function StockDetailView({ symbol }: StockDetailViewProps) {
  const { data: detail, isLoading, error } = useStockDetail(symbol);

  if (isLoading) {
    return <LoadingView message="Loading stock details..." />;
  }

  if (error) {
    const err = error as Error & { status?: number };
    const isRateLimit = err.status === 429;
    
    return (
      <ErrorView
        title={isRateLimit ? "Rate Limit Exceeded" : "Failed to load stock details"}
        message={isRateLimit 
          ? "Too many requests. Please wait a moment and try again."
          : "Please try again later"}
      />
    );
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="w-full">
      <StockDetailCard detail={detail} symbol={symbol} />
    </div>
  );
}
