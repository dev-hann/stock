import { useQuery } from "@tanstack/react-query";
import stockUseCase from "@/src/use-cases/stock-use-case";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "@/src/domain/stock/time-series";
import { stockTimeSeriesKeys } from "@/src/constants/query-keys";

export default function useStockTimeSeries(
  symbol: string | null,
  type: TimeSeriesType = "DAILY",
) {
  const queryKey = stockTimeSeriesKeys.timeSeries(symbol, type);

  console.log(`[useStockTimeSeries] Hook called for ${symbol} - ${type}`);
  console.log(`[useStockTimeSeries] Query key:`, queryKey);

  const result = useQuery<TimeSeriesDataPoint[]>({
    queryKey,
    queryFn: async () => {
      console.log(
        `[useStockTimeSeries] queryFn executing for ${symbol} - ${type}`,
      );
      if (!symbol) throw new Error("Symbol is required");
      const data = await stockUseCase.getTimeSeries(symbol, type);
      console.log(`[useStockTimeSeries] queryFn result: ${data.length} points`);
      return data;
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 10, // 10 minutes - match server cache
  });

  console.log(`[useStockTimeSeries] Query state for ${type}:`, {
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    dataLength: result.data?.length || 0,
    error: result.error,
  });

  return result;
}
