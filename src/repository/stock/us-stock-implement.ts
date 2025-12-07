import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import { TimeSeriesDataPoint } from "../../domain/stock/time-series";
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
    const data = await this.client.get<USStockSearchResponse>({
      function: "SYMBOL_SEARCH",
      keywords: query,
    });

    console.log("Search API Response:", data);

    if (!data.bestMatches) {
      console.log("No bestMatches in response");
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
    const data = await this.client.getStockOverview(symbol);

    console.log("Detail API Response for", symbol, ":", data);

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

  async getTimeSeries(symbol: string): Promise<TimeSeriesDataPoint[]> {
    const data = await this.client.getTimeSeriesDaily(symbol);

    console.log("TimeSeries API Response for", symbol, ":", data);

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      console.log("No time series data in response");
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
        volume: parseInt(values["5. volume"]),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Return last 30 days
    return dataPoints.slice(-30);
  }
}
