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
  return useQuery<TimeSeriesDataPoint[]>({
    queryKey: stockTimeSeriesKeys.timeSeries(symbol, type),
    queryFn: async () => {
      if (!symbol) throw new Error("Symbol is required");
      const data = await stockUseCase.getTimeSeries(symbol, type);
      return data;
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
