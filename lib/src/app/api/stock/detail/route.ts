import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance({
  fetch: async (input, init?) => {
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    return response;
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");

    if (!symbol || symbol.trim().length === 0) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 },
      );
    }

    const result = await yahooFinance.quoteSummary(symbol, {
      modules: [
        "price",
        "summaryDetail",
        "assetProfile",
        "defaultKeyStatistics",
        "financialData",
      ],
    });

    const price = (result as any).price || {};
    const summaryDetail = (result as any).summaryDetail || {};
    const assetProfile = (result as any).assetProfile || {};
    const keyStats = (result as any).defaultKeyStatistics || {};
    const financialData = (result as any).financialData || {};

    const detail = {
      symbol: price.symbol || symbol,
      name: price.longName || price.shortName || "",
      description: assetProfile.longBusinessSummary || "",
      exchange: price.exchangeName || "",
      sector: assetProfile.sector || "",
      industry: assetProfile.industry || "",
      marketCap: price.marketCap?.toString() || "0",
      peRatio: summaryDetail.trailingPE?.toString() || "0",
      eps: keyStats.trailingEps?.toString() || "0",
      weekHigh52: summaryDetail.fiftyTwoWeekHigh?.toString() || "0",
      weekLow52: summaryDetail.fiftyTwoWeekLow?.toString() || "0",
      dividendYield: summaryDetail.dividendYield?.toString() || "0",
      beta: keyStats.beta?.toString() || "0",
      revenue: financialData.totalRevenue?.toString() || "0",
      profitMargin: financialData.profitMargins?.toString() || "0",
      operatingMargin: financialData.operatingMargins?.toString() || "0",
      returnOnEquity: financialData.returnOnEquity?.toString() || "0",
      country: assetProfile.country || "US",
      currency: price.currency || "USD",
    };

    return NextResponse.json(detail, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error: any) {
    console.error("[API Detail Error]", error);
    
    // Check if it's a rate limit error
    if (error.message?.includes("Too Many Requests") || error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few moments." },
        { status: 429 },
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch stock details" },
      { status: 500 },
    );
  }
}
