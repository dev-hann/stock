import { useEffect } from "react";
import StockDetail from "../domain/stock/stock-detail";

interface UseDynamicMetadataProps {
  stockDetail: StockDetail | null;
  isLoading: boolean;
}

export default function useDynamicMetadata({
  stockDetail,
  isLoading,
}: UseDynamicMetadataProps) {
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (stockDetail) {
      // Update title
      const title = `${stockDetail.symbol} - ${stockDetail.name} | Market Search`;
      document.title = title;

      // Update meta description
      const description = `View detailed information for ${stockDetail.name} (${stockDetail.symbol}). Sector: ${stockDetail.sector}, Industry: ${stockDetail.industry}, Exchange: ${stockDetail.exchange}`;

      updateMetaTag("description", description);
      updateMetaTag("og:title", title, "property");
      updateMetaTag("og:description", description, "property");
      updateMetaTag("twitter:title", title);
      updateMetaTag("twitter:description", description);
    } else {
      // Reset to default
      document.title = "Market Search - Real-time Stock Search";
      const defaultDescription =
        "Search for stocks, ETFs, and market indices with real-time autocomplete. Get detailed information and charts for your favorite stocks.";

      updateMetaTag("description", defaultDescription);
      updateMetaTag(
        "og:title",
        "Market Search - Real-time Stock Search",
        "property",
      );
      updateMetaTag("og:description", defaultDescription, "property");
      updateMetaTag("twitter:title", "Market Search - Real-time Stock Search");
      updateMetaTag("twitter:description", defaultDescription);
    }
  }, [stockDetail, isLoading]);
}

function updateMetaTag(
  name: string,
  content: string,
  attribute: "name" | "property" = "name",
) {
  let element = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}
