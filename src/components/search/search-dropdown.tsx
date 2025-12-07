import { match } from "ts-pattern";
import { SearchState } from "@/src/hook/types";
import StockListItem from "./stock-list-item";

interface SearchDropdownProps {
    searchState: SearchState;
    onSelectStock: (symbol: string) => void;
}

export default function SearchDropdown({ searchState, onSelectStock }: SearchDropdownProps) {
    return (
        <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-2xl ring-1 ring-slate-200 border-t border-slate-100 overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {match(searchState)
                .with({ type: 'results' }, ({ data }) => (
                    <>
                        <ul className="py-2">
                            {data.map((stock, index) => (
                                <StockListItem
                                    key={`${stock.symbol}-${index}`}
                                    stock={stock}
                                    onSelect={onSelectStock}
                                />
                            ))}
                        </ul>

                        <div className="bg-slate-50/50 px-5 py-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <span>{data.length} results found</span>
                            <span>Select to view details</span>
                        </div>
                    </>
                ))
                .with({ type: 'no-results' }, ({ query }) => (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-900 font-medium">검색 결과가 없습니다</p>
                        <p className="text-slate-500 text-sm mt-1">"{query}"에 대한 검색 결과가 없습니다.</p>
                    </div>
                ))
                .with({ type: 'error' }, ({ message }) => (
                    <div className="p-6 text-center text-red-500">
                        <p>{message}</p>
                    </div>
                ))
                .otherwise(() => null)}
        </div>
    );
}
