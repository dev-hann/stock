"use client";

import { useState } from "react";
import useStockSearch from "@/src/hook/use-stock-search";
import SearchInput from "@/src/components/search/search-input";
import StockListItem from "@/src/components/search/stock-list-item";
import StockDetailView from "@/src/components/stock-detail/stock-detail-view";

export default function Home() {
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const {
        query,
        searchState,
        onQueryChange,
        reset,
        setQuery,
        isFocused,
        setIsFocused,
        containerRef
    } = useStockSearch();

    const handleSelectStock = (symbol: string) => {
        setQuery(symbol);
        setSelectedStock(symbol);
        setIsFocused(false);
    };

    const handleReset = () => {
        reset();
        setSelectedStock(null);
        setIsFocused(true);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e);
        setSelectedStock(null);
    }

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-start bg-white p-4 pt-20 font-sans text-slate-900 overflow-y-auto">
            {/* Title / Hero Section */}
            <div className="text-center mb-10 space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Market <span className="text-blue-600">Search</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">
                    Search for stocks, ETFs, and market indices with real-time autocomplete.
                </p>
            </div>

            <div ref={containerRef} className="w-full max-w-2xl relative z-50 group">
                <SearchInput
                    query={query}
                    isFocused={isFocused}
                    searchState={searchState}
                    onQueryChange={handleQueryChange}
                    onFocus={() => setIsFocused(true)}
                    onReset={handleReset}
                    inputRoundedClass="rounded-2xl"
                />
            </div>

            {selectedStock ? (
                <div className="w-full max-w-2xl mt-2">
                    <StockDetailView symbol={selectedStock} />
                </div>
            ) : (
                query.length > 0 && searchState.type !== 'idle' && (
                    <div className="w-full max-w-2xl mt-2">
                        {searchState.type === 'loading' && (
                            <div className="p-4 text-center text-slate-500">Loading...</div>
                        )}
                        {searchState.type === 'error' && (
                            <div className="p-4 text-center text-red-500">{searchState.message}</div>
                        )}
                        {searchState.type === 'results' && (
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                                <ul>
                                    {searchState.data.map((stock) => (
                                        <StockListItem key={stock.symbol} stock={stock} onSelect={handleSelectStock} />
                                    ))}
                                </ul>
                            </div>
                        )}
                        {searchState.type === 'no-results' && (
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-4 text-center text-slate-500">
                                    No results found for "{searchState.query}".
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl rounded-full" />
            </div>
        </main>
    );
}
