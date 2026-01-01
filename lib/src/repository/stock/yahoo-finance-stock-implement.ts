import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "../../domain/stock/time-series";
import YahooFinanceApiClient from "../../service/api-client/yahoo-finance-api-client";
import StockRepository from "./stock-repository";

export default class YahooFinanceStockImplement implements StockRepository {
  private client: YahooFinanceApiClient;

  constructor() {
    this.client = new YahooFinanceApiClient();
  }

  async search(query: string): Promise<Stock[]> {
    try {
      const data = await this.client.get<any[]>(
        "/stock/search",
        {
          q: query,
        },
        {
          revalidate: 300,
        },
      );

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        type: item.type,
        region: item.region,
        marketOpen: item.marketOpen || "",
        marketClose: item.marketClose || "",
        timezone: item.timezone || "",
        currency: item.currency || "USD",
        matchScore: item.matchScore || 1.0,
      }));
    } catch (error) {
      console.error("[YahooFinance] Error searching:", error);
      return [];
    }
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    try {
      const data = await this.client.get<any>(
        "/stock/detail",
        {
          symbol: symbol,
        },
        {
          revalidate: 3600,
        },
      );

      return {
        symbol: data.symbol || symbol,
        name: data.name || "",
        description: data.description || "",
        exchange: data.exchange || "",
        sector: data.sector || "",
        industry: data.industry || "",
        marketCap: data.marketCap || "0",
        peRatio: data.peRatio || "0",
        eps: data.eps || "0",
        weekHigh52: data.weekHigh52 || "0",
        weekLow52: data.weekLow52 || "0",
        dividendYield: data.dividendYield || "0",
        beta: data.beta || "0",
        revenue: data.revenue || "0",
        profitMargin: data.profitMargin || "0",
        operatingMargin: data.operatingMargin || "0",
        returnOnEquity: data.returnOnEquity || "0",
        country: data.country || "US",
        currency: data.currency || "USD",
      };
    } catch (error) {
      console.error(
        `[YahooFinance] Error fetching detail for ${symbol}:`,
        error,
      );
      throw error;
    }
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const data = await this.client.get<any[]>(
        "/stock/chart",
        {
          symbol: symbol,
          type: type,
        },
        {
          revalidate: 600,
        },
      );

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => ({
        date: item.date,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0,
      }));
    } catch (error) {
      console.error(
        `[YahooFinance] Error fetching time series for ${symbol}:`,
        error,
      );
      return [];
    }
  }
}