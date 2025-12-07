import { useQuery } from "@tanstack/react-query";
import stockUseCase from "@/src/use-cases/stock-use-case";
import { TimeSeriesDataPoint } from "@/src/domain/stock/time-series";

export default function useStockTimeSeries(symbol: string | null) {
    return useQuery<TimeSeriesDataPoint[]>({
        queryKey: ['stock-timeseries', symbol],
        queryFn: async () => {
            if (!symbol) throw new Error('Symbol is required');
            return stockUseCase.getTimeSeries(symbol);
        },
        enabled: !!symbol,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
}
