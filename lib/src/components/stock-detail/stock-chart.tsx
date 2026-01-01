"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useStockTimeSeries from "@/src/hook/use-stock-timeseries";
import { TimeSeriesType } from "@/src/domain/stock/time-series";
import LoadingView from "../common/loading-view";
import ErrorView from "../common/error-view";

interface StockChartProps {
  symbol: string;
  timeSeriesType: TimeSeriesType;
}

export default function StockChart({
  symbol,
  timeSeriesType,
}: StockChartProps) {
  const {
    data: timeSeries,
    isLoading,
    error,
  } = useStockTimeSeries(symbol, timeSeriesType);

  if (isLoading) {
    return (
      <LoadingView message="Loading chart data..." className="h-[350px]" />
    );
  }

  if (error || !timeSeries || timeSeries.length === 0) {
    return (
      <ErrorView
        title="Unable to load chart data"
        message="Please try again later"
        className="h-[350px]"
      />
    );
  }

  const chartData = timeSeries.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: point.close,
  }));

  return (
    <div className="bg-slate-50 rounded-xl p-4 h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#64748b"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#64748b"
            domain={["dataMin - 10", "dataMax + 10"]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
