"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStockTimeSeries from "@/src/hook/use-stock-timeseries";

interface StockChartProps {
    symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
    const { data: timeSeries, isLoading, error } = useStockTimeSeries(symbol);

    if (isLoading) {
        return (
            <div className="bg-slate-50 rounded-xl p-8 flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-slate-500 text-sm">Loading chart data...</p>
                </div>
            </div>
        );
    }

    if (error || !timeSeries || timeSeries.length === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-8 flex items-center justify-center h-64">
                <p className="text-slate-500">Unable to load chart data</p>
            </div>
        );
    }

    // Format data for recharts
    const chartData = timeSeries.map(point => ({
        date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: point.close,
    }));

    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#64748b"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#64748b"
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 text-center mt-2">Last 30 days closing prices</p>
        </div>
    );
}
