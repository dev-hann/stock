"use client";

import useStockSearch from "@/src/hook/use-stock-search";
import { useEffect, useRef, useState } from "react";

export default function SearchPage() {
  const { query, results, loading, error, onQueryChange, reset, setQuery } =
    useStockSearch();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.length > 0;
  const showDropdown = (query.length > 0 && (hasResults || loading || error));

  // Decide rounded corners based on dropdown state
  const inputRoundedClass = showDropdown && isFocused ? "rounded-t-2xl rounded-b-none" : "rounded-2xl";

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">

      {/* Title / Hero Section */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Market <span className="text-blue-600">Search</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Search for stocks, ETFs, and market indices with real-time autocomplete.
        </p>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-2xl relative z-50 group"
      >
        {/* Search Input Container */}
        <div
          className={`
            bg-white shadow-xl transition-all duration-200 ring-1 ring-slate-200
            ${inputRoundedClass}
            ${isFocused ? 'ring-2 ring-blue-500/50 shadow-2xl' : 'hover:shadow-2xl'}
          `}
        >
          <div className="relative flex items-center h-16">
            {/* Search Icon / Spinner */}
            <div className="absolute left-0 pl-5 flex items-center pointer-events-none">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <svg
                  className={`h-6 w-6 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>

            <input
              type="text"
              value={query}
              onChange={onQueryChange}
              onFocus={() => setIsFocused(true)}
              className="w-full h-full bg-transparent text-xl font-medium text-slate-800 placeholder:text-slate-400 pl-14 pr-12 focus:outline-none"
              placeholder="Type a symbol or company..."
              autoComplete="off"
            />

            {/* Reset Button */}
            {query && (
              <button
                onClick={() => {
                  reset();
                  setIsFocused(true); // Keep focus to allow typing again immediately
                }}
                className="absolute right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors p-2"
                title="Clear search"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Floating Dropdown Results */}
        {showDropdown && isFocused && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-2xl ring-1 ring-slate-200 border-t border-slate-100 overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

            {/* Results List */}
            {hasResults && (
              <ul className="py-2">
                {results.map((stock, index) => (
                  <li key={`${stock.symbol}-${index}`}>
                    <button
                      className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group/item"
                      onClick={() => {
                        setQuery(stock.symbol);
                        setIsFocused(false);
                      }}
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
                ))}
              </ul>
            )}

            {/* Footer / Meta info */}
            {hasResults && (
              <div className="bg-slate-50/50 px-5 py-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                <span>{results.length} results found</span>
                <span>Select to view details</span>
              </div>
            )}

            {/* No Results State */}
            {!hasResults && !loading && (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                  <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-slate-900 font-medium">No results for "{query}"</p>
                <p className="text-slate-500 text-sm mt-1">Check your spelling or try a different symbol.</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-6 text-center text-red-500">
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl rounded-full" />
      </div>

    </main>
  );
}
