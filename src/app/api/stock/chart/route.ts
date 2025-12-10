import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

export const runtime = "nodejs";

const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });

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

    console.log(
      `[Chart API] Fetching ${symbol} with interval ${interval}, period1:`,
      period1,
      "period2:",
      period2,
    );

    const result = await yahooFinance.chart(symbol, queryOptions);

    if (!result || !result.quotes || result.quotes.length === 0) {
      console.log(`[Chart API] No data returned for ${symbol}`);
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

    console.log(
      `[Chart API] Returning ${last30.length} data points for ${symbol}`,
    );

    return NextResponse.json(last30, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("[API Chart Error]", error);
    console.error("[API Chart Error Stack]", (error as Error).stack);
    return NextResponse.json(
      {
        error: "Failed to fetch chart data",
        details: (error as Error).message,
      },
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
