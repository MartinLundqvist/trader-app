import { describe, expect, it } from '@jest/globals';
import { marketDataSchema } from '../schemas/index.js';

describe('schemas', () => {
  it('should validate market data', () => {
    const marketData = [
      {
        open: 1,
        high: 2,
        low: 3,
        close: 4,
        volume: 5,
        adj_high: 6,
        adj_low: 7,
        adj_close: 8,
        adj_open: 9,
        adj_volume: 10,
        split_factor: 11,
        dividend: 12,
        symbol: 'AAPL',
        exchange: 'NASDAQ',
        date: '2021-01-01',
      },
    ];

    const parsedData = [
      {
        open: 1,
        high: 2,
        low: 3,
        close: 4,
        volume: 5,
        symbol: 'AAPL',
        exchange: 'NASDAQ',
        date: new Date('2021-01-01'),
      },
    ];

    const results = marketDataSchema.parse(marketData);

    expect(results).toEqual(parsedData);
  });
});
