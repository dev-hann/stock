export default interface Stock {
  symbol: string;
  name: string;
  type: string;
  region?: string;
  marketOpen?: string;
  marketClose?: string;
  timezone?: string;
  currency?: string;
  matchScore?: number;
}
