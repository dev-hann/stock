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
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const result = await yahooFinance.search(query, {
      quotesCount: 10,
      newsCount: 0,
    });

    const stocks = ((result as any).quotes || [])
      .filter(
        (item: any) => item.quoteType === "EQUITY" || item.quoteType === "ETF",
      )
      .map((item: any) => ({
        symbol: item.symbol,
        name: item.longname || item.shortname || item.symbol,
        type: item.quoteType,
        region: item.exchDisp || "",
        marketOpen: "",
        marketClose: "",
        timezone: "",
        currency: "USD",
        matchScore: 1.0,
      }));

    return NextResponse.json(stocks, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("[API Search Error]", error);
    
    // Check if it's a rate limit error
    if (error.message?.includes("Too Many Requests") || error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few moments." },
        { status: 429 },
      );
    }
    
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 },
    );
  }
}
