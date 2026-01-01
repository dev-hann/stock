import Stock from "@/src/domain/stock/stock";
import StockDetail from "@/src/domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "@/src/domain/stock/time-series";
import StockRepository from "@/src/repository/stock/stock-repository";
import YahooFinanceStockImplement from "@/src/repository/stock/yahoo-finance-stock-implement";

class StockUseCase {
  private repository: StockRepository;

  constructor() {
    this.repository = new YahooFinanceStockImplement();
  }

  async search(query: string): Promise<Stock[]> {
    return this.repository.search(query);
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    return this.repository.getDetail(symbol);
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    return this.repository.getTimeSeries(symbol, type);
  }
}

const stockUseCase = new StockUseCase();
export default stockUseCase;
