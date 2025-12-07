import { useQuery } from "@tanstack/react-query";
import stockUseCase from "@/src/use-cases/stock-use-case";
import { stockDetailKeys } from "@/src/constants/query-keys";
import StockDetail from "@/src/domain/stock/stock-detail";

export default function useStockDetail(symbol: string | null) {
    return useQuery<StockDetail>({
        queryKey: stockDetailKeys.detail(symbol || ''),
        queryFn: async () => {
            if (!symbol) throw new Error('Symbol is required');
            return stockUseCase.getDetail(symbol);
        },
        enabled: !!symbol,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
}
