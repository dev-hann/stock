import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-4 font-sans text-slate-900">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-2xl font-bold text-slate-700">
            Stock Not Found
          </h2>
        </div>

        <p className="text-lg text-slate-500">
          The stock symbol you&apos;re looking for doesn&apos;t exist or
          couldn&apos;t be loaded.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl rounded-full" />
      </div>
    </main>
  );
}
