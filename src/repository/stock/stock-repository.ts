import Stock from "@/src/domain/stock/stock";

export default interface StockRepository {
  search(query: string): Promise<Stock[]>;
}
