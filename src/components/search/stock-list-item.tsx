import Stock from "@/src/domain/stock/stock";

interface StockListItemProps {
    stock: Stock;
    onSelect: (symbol: string) => void;
}

export default function StockListItem({ stock, onSelect }: StockListItemProps) {
    return (
        <li>
            <button
                className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group/item"
                onClick={() => onSelect(stock.symbol)}
            >
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm border border-blue-100 group-hover/item:border-blue-200 group-hover/item:shadow-sm transition-all">
                        {stock.symbol.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-lg truncate">{stock.symbol}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                {stock.type}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{stock.name}</p>
                    </div>
                </div>

                <div className="flex-shrink-0 text-right hidden sm:block">
                    {stock.currency && <span className="text-xs font-medium text-slate-400">{stock.currency}</span>}
                </div>
            </button>
        </li>
    );
}
