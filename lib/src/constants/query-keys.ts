import { TimeSeriesType } from "../domain/stock/time-series";

export const stockKeys = {
    all: ['stocks'] as const,
    search: (query: string) => [...stockKeys.all, 'search', query] as const,
};

export const stockDetailKeys = {
    all: ['stock-detail'] as const,
    detail: (symbol: string) => [...stockDetailKeys.all, symbol] as const,
};

export const stockTimeSeriesKeys = {
    all: ['stock-timeseries'] as const,
    timeSeries: (symbol: string | null, type: TimeSeriesType) => [...stockTimeSeriesKeys.all, symbol, type] as const,
};
