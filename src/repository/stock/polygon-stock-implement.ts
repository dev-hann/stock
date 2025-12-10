import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "../../domain/stock/time-series";
import PolygonApiClient from "../../service/api-client/polygon-api-client";
import StockRepository from "./stock-repository";

export default class PolygonStockImplement implements StockRepository {
  private client: PolygonApiClient;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) {
      throw new Error("Polygon API key not found");
    }

    this.client = new PolygonApiClient(apiKey);
  }

  async search(query: string): Promise<Stock[]> {
    try {
      const data = await this.client.searchTickers(query, {
        revalidate: 300,
      });

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results
        .filter((item: any) => item.market === "stocks")
        .map((item: any) => ({
          symbol: item.ticker,
          name: item.name,
          type: item.type,
          region: item.locale?.toUpperCase() || "US",
          marketOpen: "",
          marketClose: "",
          timezone: "",
          currency: item.currency_name || "USD",
          matchScore: 1.0,
        }));
    } catch (error) {
      console.error("[Polygon] Error searching:", error);
      return [];
    }
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    try {
      const data = await this.client.getTickerDetails(symbol, {
        revalidate: 3600,
      });

      const result = data.results;
      if (!result) {
        throw new Error("No data found for symbol: " + symbol);
      }

      const marketCap = result.market_cap ? result.market_cap.toFixed(0) : "0";

      const address = result.address || {};
      const country = address.state ? "US" : "";

      return {
        symbol: result.ticker || symbol,
        name: result.name || "",
        description: result.description || "",
        exchange: result.primary_exchange || "",
        sector: result.sic_description || "",
        industry: result.sic_description || "",
        marketCap: marketCap,
        peRatio: "0",
        eps: "0",
        weekHigh52: "0",
        weekLow52: "0",
        dividendYield: "0",
        beta: "0",
        revenue: "0",
        profitMargin: "0",
        operatingMargin: "0",
        returnOnEquity: "0",
        country: country,
        currency: result.currency_name || "USD",
      };
    } catch (error) {
      console.error(`[Polygon] Error fetching detail for ${symbol}:`, error);
      throw error;
    }
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const { multiplier, timespan, days } = this.getTimeSeriesParams(type);

      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - days);

      const fromStr = from.toISOString().split("T")[0];
      const toStr = to.toISOString().split("T")[0];

      const data = await this.client.getAggregates(
        symbol,
        multiplier,
        timespan,
        fromStr,
        toStr,
        {
          revalidate: 600,
        },
      );

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      const dataPoints: TimeSeriesDataPoint[] = data.results.map(
        (item: any) => ({
          date: new Date(item.t).toISOString().split("T")[0],
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
          volume: item.v,
        }),
      );

      return dataPoints.slice(-30);
    } catch (error) {
      console.error(
        `[Polygon] Error fetching time series for ${symbol}:`,
        error,
      );
      return [];
    }
  }

  private getTimeSeriesParams(type: TimeSeriesType): {
    multiplier: number;
    timespan: string;
    days: number;
  } {
    switch (type) {
      case "DAILY":
        return {
          multiplier: 1,
          timespan: "day",
          days: 90,
        };
      case "WEEKLY":
        return {
          multiplier: 1,
          timespan: "week",
          days: 365,
        };
      case "MONTHLY":
        return {
          multiplier: 1,
          timespan: "month",
          days: 730,
        };
      default:
        return {
          multiplier: 1,
          timespan: "day",
          days: 90,
        };
    }
  }
}
