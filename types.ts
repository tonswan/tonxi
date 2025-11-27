export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: string;
  tvl: string;
  category: 'Privacy' | 'Yield' | 'Stable';
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Swap';
  asset: string;
  amount: number;
  timestamp: string;
  status: 'Completed' | 'Pending';
  hash: string;
}

export enum Tab {
  MARKET = 'MARKET',
  SWAP = 'SWAP',
  PORTFOLIO = 'PORTFOLIO',
  INSIGHTS = 'INSIGHTS'
}

export interface AIAnalysis {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number; // 0-100
  summary: string;
  keyLevels: string[];
}