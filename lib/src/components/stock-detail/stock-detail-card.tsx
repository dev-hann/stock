import { useState } from "react";
import StockDetail from "@/src/domain/stock/stock-detail";
import StockMetric from "./stock-metric";
import StockChart from "./stock-chart";
import { TimeSeriesType } from "@/src/domain/stock/time-series";

interface StockDetailCardProps {
  detail: StockDetail;
  symbol: string;
}

function formatMarketCap(value: string): string {
  const num = parseFloat(value);
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
}

function formatRevenue(value: string): string {
  return formatMarketCap(value);
}

function formatPercent(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return `${(num * 100).toFixed(2)}%`;
}

export default function StockDetailCard({
  detail,
  symbol,
}: StockDetailCardProps) {
  const [timeSeriesType, setTimeSeriesType] = useState<TimeSeriesType>("DAILY");

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden">
      {/* Header with Close Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
        <div className="flex items-start justify-between pr-12">
          <div>
            <h1 className="text-3xl font-bold">{detail.symbol}</h1>
            <p className="text-blue-100 mt-1">{detail.name}</p>
            <p className="text-blue-200 text-sm mt-1">{detail.exchange}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Price Chart */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Price Chart</h2>
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setTimeSeriesType("DAILY")}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${timeSeriesType === "DAILY" ? "bg-white shadow-sm text-blue-600" : "text-slate-600"}`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeSeriesType("WEEKLY")}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${timeSeriesType === "WEEKLY" ? "bg-white shadow-sm text-blue-600" : "text-slate-600"}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeSeriesType("MONTHLY")}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${timeSeriesType === "MONTHLY" ? "bg-white shadow-sm text-blue-600" : "text-slate-600"}`}
              >
                Monthly
              </button>
            </div>
          </div>
          <StockChart symbol={symbol} timeSeriesType={timeSeriesType} />
        </section>

        {/* About */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {detail.description}
          </p>
          <div className="flex gap-4 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {detail.sector}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {detail.industry}
            </span>
          </div>
        </section>

        {/* Key Metrics */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            <StockMetric label="P/E Ratio" value={detail.peRatio} />
            <StockMetric label="EPS" value={detail.eps} />
            <StockMetric label="Beta" value={detail.beta} />
            <StockMetric
              label="Market Cap"
              value={formatMarketCap(detail.marketCap)}
            />
            <StockMetric
              label="Dividend Yield"
              value={formatPercent(detail.dividendYield)}
            />
            <StockMetric label="52W High" value={`$${detail.weekHigh52}`} />
          </div>
        </section>

        {/* Financial Highlights */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Financial Highlights
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Revenue (TTM)</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatRevenue(detail.revenue)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Profit Margin</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatPercent(detail.profitMargin)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Operating Margin</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatPercent(detail.operatingMargin)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Return on Equity</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatPercent(detail.returnOnEquity)}
              </span>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="pt-4 border-t border-slate-200">
          <div className="flex gap-6 text-xs text-slate-500">
            <span>
              Country:{" "}
              <span className="font-medium text-slate-700">
                {detail.country}
              </span>
            </span>
            <span>
              Currency:{" "}
              <span className="font-medium text-slate-700">
                {detail.currency}
              </span>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
