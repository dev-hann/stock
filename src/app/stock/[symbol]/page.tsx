import { Metadata } from "next";
import stockUseCase from "@/src/use-cases/stock-use-case";
import StockDetailClientView from "@/src/components/stock-detail/stock-detail-client-view";

interface StockPageProps {
  params: {
    symbol: string;
  };
}

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;

  try {
    const stockDetail = await stockUseCase.getDetail(symbol.toUpperCase());

    const title = `${stockDetail.symbol} - ${stockDetail.name} | Market Search`;
    const description = `View detailed information for ${stockDetail.name} (${stockDetail.symbol}). Sector: ${stockDetail.sector}, Industry: ${stockDetail.industry}, Exchange: ${stockDetail.exchange}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: `${symbol.toUpperCase()} - Stock Not Found | Market Search`,
      description: "The requested stock could not be found.",
    };
  }
}

export default function StockPage({ params }: StockPageProps) {
  const { symbol } = params;
  const upperSymbol = symbol.toUpperCase();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-white p-4 pt-20 font-sans text-slate-900 overflow-y-auto">
      {/* Title / Hero Section */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Market <span className="text-blue-600">Search</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Stock Information
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <StockDetailClientView symbol={upperSymbol} />
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl rounded-full" />
      </div>
    </main>
  );
}