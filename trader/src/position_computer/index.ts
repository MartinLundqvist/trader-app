import got from 'got';
import { MarketData } from '../types/index.js';

const testData: MarketData = [
  {
    open: 144.38,
    high: 146.71,
    low: 143.9,
    close: 145.91,
    volume: 52279761,
    symbol: 'AAPL',
    exchange: 'XNAS',
    date: new Date('2023-03-02T00:00:00+0000'),
  },
  {
    open: 246.55,
    high: 251.4,
    low: 245.61,
    close: 251.11,
    volume: 24808200,
    symbol: 'MSFT',
    exchange: 'XNAS',
    date: new Date('2023-03-02T00:00:00+0000'),
  },
];

export const getSignal = async (ticker: string) => {
  const url = 'http://127.0.0.1:4000/test';
  const response = await got.post(url, {
    headers: { 'Content-Type': 'application/json' },
    json: testData,
  });

  return response.body;
};
