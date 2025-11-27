import { Asset, Transaction } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'ZkTon',
    symbol: 'ZTON',
    price: 4.25,
    change24h: 5.2,
    volume: '12.5M',
    tvl: '450M',
    category: 'Privacy'
  },
  {
    id: '2',
    name: 'Shield Note',
    symbol: 'sUSDT',
    price: 1.01,
    change24h: 0.05,
    volume: '5.2M',
    tvl: '120M',
    category: 'Stable'
  },
  {
    id: '3',
    name: 'Private Yield',
    symbol: 'prYield',
    price: 15.30,
    change24h: -2.1,
    volume: '800K',
    tvl: '45M',
    category: 'Yield'
  },
  {
    id: '4',
    name: 'Anon Inu',
    symbol: 'ANON',
    price: 0.0045,
    change24h: 12.8,
    volume: '2.1M',
    tvl: '10M',
    category: 'Privacy'
  }
];

export const MOCK_HISTORY: Transaction[] = [
  { id: 'tx1', type: 'Deposit', asset: 'TON', amount: 50, timestamp: '2023-10-25 10:30', status: 'Completed', hash: '0x8f...2a' },
  { id: 'tx2', type: 'Swap', asset: 'ZTON', amount: 120, timestamp: '2023-10-24 14:15', status: 'Completed', hash: '0x7b...9c' },
  { id: 'tx3', type: 'Withdraw', asset: 'sUSDT', amount: 500, timestamp: '2023-10-23 09:45', status: 'Completed', hash: '0x3d...1f' },
];

export const MOCK_CHART_DATA = [
  { time: '00:00', value: 4.10 },
  { time: '04:00', value: 4.15 },
  { time: '08:00', value: 4.05 },
  { time: '12:00', value: 4.20 },
  { time: '16:00', value: 4.35 },
  { time: '20:00', value: 4.28 },
  { time: '24:00', value: 4.25 },
];
