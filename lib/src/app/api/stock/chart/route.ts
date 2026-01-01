import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { yahooFinanceFetch } from "@/src/lib/yahoo-finance-config";

export const runtime = "nodejs";

const yahooFinance = new YahooFinance({
  fetch: yahooFinanceFetch,
  suppressNotices: ["ripHistorical"],
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const type = searchParams.get("type") || "DAILY";

    if (!symbol || symbol.trim().length === 0) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 },
      );
    }

    const { period1, period2, interval } = getTimeSeriesParams(type);

    const queryOptions = {
      period1: period1,
      period2: period2,
      interval: interval as "1d" | "1wk" | "1mo",
    };

    const result = await yahooFinance.chart(symbol, queryOptions);

    if (!result || !result.quotes || result.quotes.length === 0) {
      return NextResponse.json([]);
    }

    const dataPoints = result.quotes
      .map((item: any) => ({
        date: item.date.toISOString().split("T")[0],
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0,
      }))
      .filter((point: any) => point.close > 0)
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

    const last30 = dataPoints.slice(-30);

    return NextResponse.json(last30, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error: any) {
    console.error("[API Chart Error]", error);
    
    // Check if it's a rate limit error
    if (error.message?.includes("Too Many Requests") || error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few moments." },
        { status: 429 },
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 },
    );
  }
}

function getTimeSeriesParams(type: string): {
  period1: Date;
  period2: Date;
  interval: string;
} {
  const now = new Date();
  const period2 = now;

  switch (type) {
    case "DAILY":
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return { period1: threeMonthsAgo, period2, interval: "1d" };

    case "WEEKLY":
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return { period1: oneYearAgo, period2, interval: "1wk" };

    case "MONTHLY":
      const twoYearsAgo = new Date(now);
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      return { period1: twoYearsAgo, period2, interval: "1mo" };

    default:
      const defaultPeriod = new Date(now);
      defaultPeriod.setMonth(now.getMonth() - 3);
      return { period1: defaultPeriod, period2, interval: "1d" };
  }
}
