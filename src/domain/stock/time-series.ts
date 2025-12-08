export interface TimeSeriesDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type TimeSeriesType = 'DAILY' | 'WEEKLY' | 'MONTHLY';
