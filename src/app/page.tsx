"use client";

import { useRouter } from "next/navigation";
import { match } from "ts-pattern";
import useStockSearch from "@/src/hook/use-stock-search";
import SearchInput from "@/src/components/search/search-input";
import StockListItem from "@/src/components/search/stock-list-item";
import Stock from "@/src/domain/stock/stock";

export default function Home() {
  const router = useRouter();
  const {
    query,
    searchState,
    onQueryChange,
    reset,
    isFocused,
    setIsFocused,
    containerRef,
  } = useStockSearch();

  const handleSelectStock = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  const handleReset = () => {
    reset();
    setIsFocused(true);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e);
  };

  const renderSearchResults = () => {
    if (query.length === 0 || searchState.type === "idle") {
      return null;
    }

    return (
      <div className="w-full max-w-2xl mt-2">
        {match(searchState)
          .with({ type: "loading" }, () => (
            <div className="p-4 text-center text-slate-500">Loading...</div>
          ))
          .with({ type: "error" }, (state) => (
            <div className="p-4 text-center text-red-500">{state.message}</div>
          ))
          .with({ type: "results" }, (state) => (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              <ul>
                {state.data.map((stock: Stock) => (
                  <StockListItem
                    key={stock.symbol}
                    stock={stock}
                    onSelect={handleSelectStock}
                  />
                ))}
              </ul>
            </div>
          ))
          .with({ type: "no-results" }, (state) => (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 text-center text-slate-500">
                No results found for &quot;{state.query}&quot;.
              </div>
            </div>
          ))
          .exhaustive()}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-white p-4 pt-20 font-sans text-slate-900 overflow-y-auto">
      {/* Title / Hero Section */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Market <span className="text-blue-600">Search</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Search for stocks, ETFs, and market indices with real-time
          autocomplete.
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

      {renderSearchResults()}

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl rounded-full" />
      </div>
    </main>
  );
}
