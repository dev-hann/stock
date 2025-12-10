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
      return stockUseCase.getTimeSeries(symbol, type);
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 10, // 10 minutes - match server cache
  });
}
