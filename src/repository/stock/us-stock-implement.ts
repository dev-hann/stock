import Stock from "../../domain/stock/stock";
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

    if (!data.bestMatches) {
      return [];
    }

    return data.bestMatches.map((match) => ({
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
}
