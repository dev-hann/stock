import Stock from "../domain/stock/stock";
import StockRepository from "../repository/stock/stock-repository";
import USStockImplement from "../repository/stock/us-stock-implement";

export class StockUseCase {
  constructor(private repositry: StockRepository) { }

  async search(query: string): Promise<Stock[]> {
    if (!query) {
      return [];
    }
    return this.repositry.search(query);
  }
}


const repository = new USStockImplement();
const stockUseCase = new StockUseCase(repository);
export default stockUseCase;
