import Stock from "@/src/domain/stock/stock";
import StockDetail from "@/src/domain/stock/stock-detail";
import { TimeSeriesDataPoint } from "@/src/domain/stock/time-series";

export default interface StockRepository {
  search(query: string): Promise<Stock[]>;
  getDetail(symbol: string): Promise<StockDetail>;
  getTimeSeries(symbol: string): Promise<TimeSeriesDataPoint[]>;
}
