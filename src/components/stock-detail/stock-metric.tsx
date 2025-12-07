interface StockMetricProps {
    label: string;
    value: string;
    className?: string;
}

export default function StockMetric({ label, value, className = "" }: StockMetricProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <span className="text-xs text-slate-500 font-medium">{label}</span>
            <span className="text-base font-semibold text-slate-900 mt-1">{value}</span>
        </div>
    );
}
