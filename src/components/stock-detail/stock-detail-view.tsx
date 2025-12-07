import useStockDetail from "@/src/hook/use-stock-detail";
import StockDetailCard from "./stock-detail-card";

interface StockDetailViewProps {
    symbol: string;
}

export default function StockDetailView({ symbol }: StockDetailViewProps) {
    const { data: detail, isLoading, error } = useStockDetail(symbol);

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-12 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-600">Loading stock details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-12 flex flex-col items-center justify-center">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-900 font-medium mb-2">Failed to load stock details</p>
                    <p className="text-slate-500 text-sm mb-4">Please try again later</p>
                </div>
            </div>
        );
    }

    if (!detail) {
        return null;
    }

    return (
        <div className="w-full">
            <StockDetailCard detail={detail} />
        </div>
    );
}
