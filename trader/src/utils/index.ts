import { Strategies } from '../types/index.js';

export const fromDateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const parseSignal = (
  trade: Strategies
): { side: 'buy' | 'sell' | null; limit: number | null } => {
  let side: 'buy' | 'sell' | null = null;
  let limit: number | null = null;

  for (const signal of trade) {
    if (signal.signal === 'Buy') {
      side = 'buy';
    }
    if (signal.signal === 'Sell') {
      side = 'sell';
    }
    if (signal.limit) {
      limit = signal.limit;
    }
  }

  return { side, limit };
};
