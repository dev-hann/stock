import { match } from "ts-pattern";
import { SearchState } from "@/src/hook/types";

interface SearchInputProps {
    query: string;
    isFocused: boolean;
    searchState: SearchState;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onReset: () => void;
    inputRoundedClass: string;
}

export default function SearchInput({
    query,
    isFocused,
    searchState,
    onQueryChange,
    onFocus,
    onReset,
    inputRoundedClass
}: SearchInputProps) {
    return (
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
                    {match(searchState)
                        .with({ type: 'loading' }, () => (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        ))
                        .otherwise(() => (
                            <svg
                                className={`h-6 w-6 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        ))}
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={onQueryChange}
                    onFocus={onFocus}
                    className="w-full h-full bg-transparent text-xl font-medium text-slate-800 placeholder:text-slate-400 pl-14 pr-12 focus:outline-none"
                    placeholder="Type a symbol or company..."
                    autoComplete="off"
                />

                {/* Reset Button */}
                {query && (
                    <button
                        onClick={onReset}
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
    );
}
