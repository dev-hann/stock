import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "../../domain/stock/time-series";
import USStockSearchResponse from "../../domain/stock/stock-search-response";
import USApiClient from "../../service/api-client/us-api-client";
import StockRepository from "./stock-repository";

export default class USStockImplement implements StockRepository {
  private client: USApiClient;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error("Alpha Vantage API key not found");
    }

    this.client = new USApiClient(apiKey);
  }

  async search(query: string): Promise<Stock[]> {
    const data = await this.client.get<USStockSearchResponse>(
      {
        function: "SYMBOL_SEARCH",
        keywords: query,
      },
      {
        // 검색 결과는 5분간 캐싱
        revalidate: 300,
      },
    );

    if (!data.bestMatches) {
      return [];
    }

    return data.bestMatches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      type: match["3. type"],
      region: match["4. region"],
      marketOpen: match["5. marketOpen"],
      marketClose: match["6. marketClose"],
      timezone: match["7. timezone"],
      currency: match["8. currency"],
      matchScore: parseFloat(match["9. matchScore"]),
    }));
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    const data = await this.client.getStockOverview(symbol, {
      // 주식 상세 정보는 1시간 캐싱
      revalidate: 3600,
    });

    return {
      symbol: data.Symbol || symbol,
      name: data.Name || "",
      description: data.Description || "",
      exchange: data.Exchange || "",
      sector: data.Sector || "",
      industry: data.Industry || "",
      marketCap: data.MarketCapitalization || "0",
      peRatio: data.PERatio || "0",
      eps: data.EPS || "0",
      weekHigh52: data["52WeekHigh"] || "0",
      weekLow52: data["52WeekLow"] || "0",
      dividendYield: data.DividendYield || "0",
      beta: data.Beta || "0",
      revenue: data.RevenueTTM || "0",
      profitMargin: data.ProfitMargin || "0",
      operatingMargin: data.OperatingMarginTTM || "0",
      returnOnEquity: data.ReturnOnEquityTTM || "0",
      country: data.Country || "",
      currency: data.Currency || "USD",
    };
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    const { apiFunction, timeSeriesKey } = this.getTimeSeriesParams(type);

    const params: Record<string, string> = {
      function: apiFunction,
      symbol: symbol,
    };

    const data = await this.client.get<any>(params, {
      // 차트 데이터는 10분간 캐싱
      revalidate: 600,
    });

    const timeSeries = data[timeSeriesKey];
    if (!timeSeries) {
      return [];
    }

    // Convert to array and sort by date (oldest first)
    const dataPoints: TimeSeriesDataPoint[] = Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"] || "0"),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Return last 30 days
    return dataPoints.slice(-30);
  }

  private getTimeSeriesParams(type: TimeSeriesType): {
    apiFunction: string;
    timeSeriesKey: string;
  } {
    switch (type) {
      case "DAILY":
        return {
          apiFunction: "TIME_SERIES_DAILY",
          timeSeriesKey: "Time Series (Daily)",
        };
      case "WEEKLY":
        return {
          apiFunction: "TIME_SERIES_WEEKLY",
          timeSeriesKey: "Weekly Time Series",
        };
      case "MONTHLY":
        return {
          apiFunction: "TIME_SERIES_MONTHLY",
          timeSeriesKey: "Monthly Time Series",
        };
      default:
        // DAILY is default
        return {
          apiFunction: "TIME_SERIES_DAILY",
          timeSeriesKey: "Time Series (Daily)",
        };
    }
  }
}
