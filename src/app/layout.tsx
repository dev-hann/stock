import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../provider/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Search - Real-time Stock Search",
  description:
    "Search for stocks, ETFs, and market indices with real-time autocomplete. Get detailed information and charts for your favorite stocks.",
  keywords: [
    "stock",
    "market",
    "search",
    "finance",
    "investment",
    "ETF",
    "trading",
  ],
  authors: [{ name: "Market Search" }],
  openGraph: {
    title: "Market Search - Real-time Stock Search",
    description:
      "Search for stocks, ETFs, and market indices with real-time autocomplete.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Search - Real-time Stock Search",
    description:
      "Search for stocks, ETFs, and market indices with real-time autocomplete.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 items-center justify-center flex min-h-screen`}
      >
        <div className="w-full max-w-3xl mx-auto min-h-screen bg-white shadow-2xl relative overflow-visible">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
