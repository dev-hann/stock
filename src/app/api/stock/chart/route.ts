import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

export const runtime = "nodejs";

const yahooFinance = new YahooFinance();

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

    const { period, interval } = getTimeSeriesParams(type);

    const queryOptions = {
      period1: period,
      interval: interval as "1d" | "1wk" | "1mo",
    };

    const result = (await yahooFinance.historical(
      symbol,
      queryOptions,
    )) as any[];

    if (!result || result.length === 0) {
      return NextResponse.json([]);
    }

    const dataPoints = result
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
  } catch (error) {
    console.error("[API Chart Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 },
    );
  }
}

function getTimeSeriesParams(type: string): {
  period: string;
  interval: string;
} {
  const now = new Date();
  let period: string;

  switch (type) {
    case "DAILY":
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      period = threeMonthsAgo.toISOString().split("T")[0];
      return { period, interval: "1d" };

    case "WEEKLY":
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      period = oneYearAgo.toISOString().split("T")[0];
      return { period, interval: "1wk" };

    case "MONTHLY":
      const twoYearsAgo = new Date(now);
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      period = twoYearsAgo.toISOString().split("T")[0];
      return { period, interval: "1mo" };

    default:
      const defaultPeriod = new Date(now);
      defaultPeriod.setMonth(now.getMonth() - 3);
      period = defaultPeriod.toISOString().split("T")[0];
      return { period, interval: "1d" };
  }
}
